import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute , Params } from '@angular/router';
import IClip from '../../models/clips.models';
import { ClipService } from '../../services/clip.service';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips:IClip[] = []
  activeClip: IClip | null =null;
  sort$:BehaviorSubject<string> 

  constructor(
    private router : Router,
    private route: ActivatedRoute,
    private clipsService : ClipService,
    private modalService: ModalService
  ){
    this.sort$ = new BehaviorSubject(this.videoOrder);
   

  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params)=>{
      this.videoOrder = params['sort']  === '2' ? params['sort']: 1;
      this.sort$.next(this.videoOrder)
    }) ;
    this.clipsService.getUserClips(this.sort$).subscribe(docs =>{
      this.clips = [];

      docs.forEach(doc =>{
        this.clips.push({
          docId:doc.id,
          ...doc.data()
        })
      })
    })
  }

  sort(event:Event){
    const {value} = (event.target as HTMLSelectElement)
    // this.router.navigateByUrl(`/manage?sort=${value}`)
    this.router.navigate([],{
      relativeTo: this.route,
      queryParams:{
        sort:value
      }
    })

  }

  openModal($event:Event , clip:IClip){
    $event.preventDefault();
    this.activeClip = clip;
    this.modalService.toggleModal('editClip');
  }

  update($event:IClip){
    this.clips.forEach((element,index)=>{
      if(element.docId == $event.docId){
        this.clips[index].title = $event.title;
      }
    })
  }

  deleteClip($event:Event, clip:IClip){
    $event.preventDefault();
    this.clipsService.deleteClip(clip);
    this.clips.forEach((element,index)=>{
      if(element.docId ==  clip.docId){
        this.clips.splice(index,1)
      }
    })
  }

  async copyToClipBoard($event:MouseEvent, docId:string |undefined){
    console.log(docId);
    $event.preventDefault();
    if(!docId){
      return
    }
    const url = `${location.origin}/clip/${docId}`;


    await navigator.clipboard.writeText(url);

    console.log('Link Copied')
  }

}
