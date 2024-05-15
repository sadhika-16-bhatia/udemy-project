import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  constructor(
    private sanitiser:DomSanitizer
  ){}
  transform(value: string){
    return this.sanitiser.bypassSecurityTrustUrl(value);
  }

}
