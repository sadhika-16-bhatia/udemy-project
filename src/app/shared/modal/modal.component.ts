import { Component, Input,OnInit,ElementRef, OnDestroy, Inject } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  // providers:[ModalService]
})
export class ModalComponent implements OnInit, OnDestroy{
  @Input() modalID ='';
  constructor(
   public  modal:ModalService,
   public ele : ElementRef,
   @Inject(DOCUMENT) public document: Document,
  ){
    // console.log(this.modal.visible);
  }
  
  ngOnInit(): void {
    document.body.appendChild(this.ele.nativeElement);
  }

  ngOnDestroy(): void {
    //document.body.removeChild(this.ele.nativeElement)
 }

  closeModal(){
    this.modal.toggleModal(this.modalID);
  }
}
