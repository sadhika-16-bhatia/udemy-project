import { Injectable } from '@angular/core';
import { createFFmpeg , fetchFile} from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isRunning = false;
  isReady = false;
  private ffmpeg   
  constructor(
    
  ) { 
    this.ffmpeg = createFFmpeg ({
      log:true
    })
  }

  async init(){
    if(this.isReady){
      return
    }

    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshorts(file:File){
    this.isRunning = true;
    const data= await fetchFile(file); 

    this.ffmpeg.FS('writeFile',file.name,data);

    const seconds = [1, 2, 3];
    const commands :string[]= [];

    seconds.forEach(second =>{
      commands.push(
        //Input
        '-i' , file.name,
        //Output options
        '-ss',`00:00:0${second}`,
        '-frames:v','1',
        '-filter:v', 'scale=510:-1',
        //Output
        `output_0${second}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands
    )

    const screenshorts :string[]=[];

    seconds.forEach(second =>{
      const screenshortFile = this.ffmpeg.FS( 'readFile',  `output_0${second}.png`)
      const screenshotBlob = new Blob(
        [screenshortFile.buffer],{
          type:'image/png'
        }
      )
      const screenshotURL = URL.createObjectURL(screenshotBlob);
      screenshorts.push(screenshotURL);
    })
    this.isRunning = false;
    return screenshorts;
  }

  async blobFromURL(url:string){
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;

  }
}
