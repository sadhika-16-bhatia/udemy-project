import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    AuthModalComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,FormsModule
  ],
  exports:[
    AuthModalComponent
  ]
})
export class UserModule { }
