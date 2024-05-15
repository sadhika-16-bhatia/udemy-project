import { Component, OnInit } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit{
  isAuthenticated = false;
  constructor(public modal:ModalService,
    public auth: AuthService,
    private afauth: AngularFireAuth,
    private router: Router

  ){
   
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  openModal($event:Event){
    $event.preventDefault();
    this.modal.toggleModal('auth');
  }

 

}
