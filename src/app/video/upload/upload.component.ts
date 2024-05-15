import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl , FormGroup , Validators} from '@angular/forms';
import { AngularFireStorage ,AngularFireUploadTask, GetDownloadURLPipeModule } from '@angular/fire/compat/storage';
import {v4 as uuid} from 'uuid';
import {last, switchMap, timestamp} from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase  from 'firebase/compat/app';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from '../../services/ffmpeg.service';
import { combineLatest } from 'rxjs';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnDestroy,OnInit{
  isDragOver = false;
  file: File | null = null;
  nextStep = false
  showAlert = false;
  alertMessage = 'Upload in progress';
  alertColor= 'blue';
  inSubmission = false;
  percentage = 0;
  showPercentage = true;
  user : firebase.User | null = null;
  task: AngularFireUploadTask | null =null;
  screenshorts :string[] =[];
  selectedScreenshort ='';
  screenshotTask?:AngularFireUploadTask;

  title = new FormControl('', {
   validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable : true
  }
  )
  uploadForm = new FormGroup({
    title : this.title
  });
  constructor(
    private storage :AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService:ClipService,
    private router: Router,
    public ffmpegService : FfmpegService
  ){

    auth.user.subscribe(user=> this.user = user);
    this.ffmpegService.init();
   
  }
  ngOnDestroy(): void {
    this.task?.cancel();
  }
  ngOnInit(): void {
    
  }

  async storeFile($event:Event){
    if(this.ffmpegService.isRunning){
      return
    }
    this.isDragOver = false;
    
    this.file =   ($event as DragEvent).dataTransfer ?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null:
    ($event.target as HTMLInputElement).files?.item(0)?? null
    ;
    if(!this.file || this.file.type != "video/mp4" ){
      return
    }
   this.screenshorts = await this.ffmpegService.getScreenshorts(this.file);
   this.selectedScreenshort = this.screenshorts[0];

  this.nextStep= true;
  this.title.setValue(
    this.file.name.replace(/\.[^/.]+$/,'')
  )

  console.log(this.file);
    
  }

  async saveForm(){
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor ='blue'
    this.alertMessage = 'Upload in progress';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName =  uuid();
  
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshort
    );
    const screensortPath= `screenshots/${clipFileName}.png`
    this.task = this.storage.upload(clipPath , this.file); 
    const clipRef = this.storage.ref(clipPath); // gives us  a reference for the file 
    const screenshotRef = this.storage.ref(screensortPath);
    this.screenshotTask=  this.storage.upload(screensortPath, screenshotBlob);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) =>{
      const [clipProgress, screenshotProgress] = progress;
      if(!clipProgress || !screenshotProgress){
        return
      }
      const total = clipProgress+ screenshotProgress
      this.percentage = total as number /200
    });

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges()
    ]).pipe(
     
      switchMap(()=> forkJoin([
        clipRef.getDownloadURL(),
        screenshotRef.getDownloadURL()
      ]))
    )
    .subscribe({
      next: async (urls)=>{
        const [clipURL, screensortURL] = urls;
        const clip ={
          uid : this.user?.uid as string,
          displayName : this.user?.displayName as string,
          title : this.title?.value,
          fileName : `${clipFileName}.mp4`,
          url:clipURL,
          screenshotURL: screensortURL,
          screenshotFileName:`${clipFileName}.png`,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()

        }
        const clipDocRef = await this.clipsService.createClip(clip);
        console.log(clip);

        this.alertColor ='green';
        this.alertMessage = 'Success! ';
        this.showPercentage = false;

       setTimeout(()=>{
        this.router.navigate([
          'clip', clipDocRef.id
        ])
       },1000)

      },
      error: (error)=>{
        this.uploadForm.enable();
        this.alertColor ='red';
        this.alertMessage ='Failed!!'
        this.inSubmission = true;
        this.showPercentage = false;
        console.log(error);
      }

  })
     
  }
  
}
