import { Component, OnInit , ViewChild,ElementRef , ViewEncapsulation} from '@angular/core';
import { ActivatedRoute , Params } from '@angular/router';
import videojs from 'video.js';
import IClip from '../models/clips.models';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.css',
  encapsulation:ViewEncapsulation.None,
  providers:[DatePipe]
})
export class ClipComponent implements OnInit{
  id = '';
  @ViewChild('videoPlayer', {static:true}) target?:ElementRef;
  player?:any; 
  clip?:IClip;

  constructor(
    public route: ActivatedRoute
  ){

  }
  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement)
   this.route.data.subscribe(data =>{
    this.clip = data.clip as IClip

    this.player?.src({
      src:this.clip.url,
      type:'video/mp4'
   })
  })
  }
}
