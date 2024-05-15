import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection ,DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../models/clips.models';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap , map } from 'rxjs/operators';
import { of , BehaviorSubject , combineLatest, Observable} from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip |null>{
  public clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] =[];
  pendingReq = false;

  constructor(
    private db:AngularFirestore,
    private authentication : AngularFireAuth,
    private storage: AngularFireStorage,
    private route: Router
  ) { 
    this.clipsCollection = db.collection('clips'); 
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IClip | Observable<IClip | null> | Promise<IClip | null> | null {
   return this.clipsCollection.doc(route.params.id)
   .get()
   .pipe(
    map(snapshot=>{
      const data = snapshot.data();

      if(!data){
        this.route.navigate(['/']);
        return null;
      }

      return data;
    })
   )
  }

   createClip(data:IClip): Promise<DocumentReference <IClip>>{
   return  this.clipsCollection.add(data);
  }

  updateClip(id:string , title:string){
    return this.clipsCollection.doc(id).update({
      title
    })
  }

  async deleteClip(clip:IClip){
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)
    await clipRef.delete();
    await screenshotRef.delete();
    await this.clipsCollection.doc(clip.docId).delete();
  }

  getUserClips(sort$:BehaviorSubject<string>){
    return combineLatest([
      this.authentication.user,
      sort$
    ]).pipe(
      switchMap((values)=>{

        const [user,sort] = values
        if (!user){
          return of([])
        }

        const query = this.clipsCollection.ref.where(
          'uid', '==' , user.uid
        ).orderBy(
          'timestamp',
          sort == '1'? 'desc' :'asc'
        )

        return query.get();
      })
      ,
      map(snapshot =>
        (snapshot as QuerySnapshot<IClip>).docs
      )
    )
  }

  async getClips(){
    if(this.pendingReq){
      return
    }

    this.pendingReq = true;
    let query = this.clipsCollection.ref.orderBy(
      'timestamp','desc'
    ).limit(6);

    const {length} = this.pageClips;

    if(length){
      const lastdocId = this.pageClips[length-1].docId;
      const lastDoc = await this.clipsCollection.doc(lastdocId)
      .get()
      .toPromise()

      query = query.startAfter(lastDoc);
    }
    const snapshot = await query.get();
    snapshot.forEach(doc =>{
      this.pageClips.push({
        docId:doc.id,
        ...doc.data()
      })
    })
    console.log(this.pageClips);
    this.pendingReq = false;
  }

}
