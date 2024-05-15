import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    credentials={
      email :'',
      password : ''
    }

    showAlert = false;
    alertMessage = 'Please wait! Login in process';
    alertColor= 'blue';
    inSubmission = false;
  constructor(private auth:AngularFireAuth){

  }

  async login(){
    this.showAlert = true;
    this.alertMessage = 'Please wait! Login in process';
    this.alertColor= 'blue';
    this.inSubmission = true;
   try{

    await this.auth.signInWithEmailAndPassword(
      this.credentials.email , this.credentials.password
    )

   }catch(e){
    this.inSubmission = false;
    this.alertMessage ='Error! TRy again ';
    this.alertColor = 'red';

    return 
   }

   this.alertMessage ='Success!'
   this.alertColor= 'green';
  }
}
