import { Component, OnDestroy, OnInit, Input , OnChanges, SimpleChanges , Output,
  EventEmitter
} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import IClip from '../../models/clips.models';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit, OnDestroy, OnChanges{
  @Input() activeClip: IClip | null = null;
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMessage =' UPdate in progress'
  @Output() update = new EventEmitter();

  clipId = new FormControl('',{
    nonNullable :true
  })
  title = new FormControl('', {
    validators: [
       Validators.required,
       Validators.minLength(3)
     ],
     nonNullable : true
   }
   )
   editForm = new FormGroup({
    id: this.clipId,
     title : this.title
   });
  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ){

  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeClip){
      return
    }

    this.clipId.setValue(this.activeClip.docId ?? '');
    this.title.setValue(this.activeClip.title);
    this.inSubmission =  false;
    this.showAlert = false;
  }
  ngOnDestroy(): void {
    this.modalService.unregister('editClip')
  }
  ngOnInit(): void {
    this.modalService.register('editClip')
  }

 async submit(){
    if(!this.activeClip){
      return
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'UPdate in progress';
    try {
      await this.clipService.updateClip(
        this.clipId.value , this.title.value
      )
    } catch (error) {
        this.inSubmission= false;
        this.alertColor ='red';
        this.alertMessage ='Something went wrong';
        return
    }
    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip);
    this.inSubmission=false;
    this.alertColor ='green';
    this.alertMessage ='Success'!
   

  }

}
