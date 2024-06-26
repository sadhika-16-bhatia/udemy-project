import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import IUser from '../models/user.model'
import { Observable , of} from 'rxjs';
import { map, delay, filter , switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute , NavigationEnd } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<IUser>;
  public isAuthenticated$ : Observable<boolean>;
  public isAuthenticatedWithDelay$ : Observable<boolean>;
  public redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db : AngularFirestore,
    private router:Router,
    private route: ActivatedRoute
    
  ) {
    this.userCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(
      map(user =>!!user)
    );
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e=> this.route.firstChild),
      switchMap(route => route?.data ?? of({authOnly: false}))
    ).subscribe((data) =>{
      this.redirect =data.authOnly ?? false;
    })
   }

  public async createUser(userData:IUser){
    if(!userData.password){
      throw new Error ("Passwrod not provided !")
    }
    const userCredentials = this.auth.createUserWithEmailAndPassword(
     userData.email, userData.password)

     if(!(await userCredentials).user){
      throw new Error('User not found');
     }
   await this.userCollection.doc((await userCredentials).user?.uid).set({
    name: userData.name,
    email: userData.email,
    age: userData.age,
    phoneNumber :userData.phoneNumber
   })

  //   await (await userCredentials).user.updateProfile({
  //     displayName: userData.name
  //  })
  }

  public async logout($event?:Event){
    if($event ){
      $event.preventDefault();
    }
   
    await this.auth.signOut();
    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
    
  }
}
