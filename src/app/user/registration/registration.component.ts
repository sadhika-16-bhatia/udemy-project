import { Component } from '@angular/core';

import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import IUser from '../../models/user.model'
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
import { privateDecrypt } from 'crypto';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  constructor(
    private auth:AuthService,
    private emailTaken:EmailTaken
  ) {

  }
  insubmission = false;
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl ('', [
    Validators.required,
    Validators.email
  ] , [this.emailTaken.validate])
  age = new FormControl<number |null >(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password = new FormControl('', [
    Validators.required,
    // Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  phoneNumber = new FormControl('', [
    // Validators.required,
    // Validators.minLength(10),
    // Validators.maxLength(13)
  ])

  showAlert = false;
  alertMessage = 'Please wait! Your account is getting created '
  alertColor = 'blue';
  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber

  },
  [RegisterValidators.match('password', 'confirmPassword')]
)

  async register() {
    this.showAlert = true;

    this.alertColor = 'blue'
    this.insubmission = true;

   

    try {
     
      await this.auth.createUser(this.registerForm.value as IUser);


    } catch (e) {
      console.log(e);
      this.showAlert = true;
      this.alertMessage = 'Unexpected error ';
      this.alertColor = 'red';
      this.insubmission = false;
      return 
    }
    this.alertMessage = 'Success ';
      this.alertColor = 'green';
  
  }
}
