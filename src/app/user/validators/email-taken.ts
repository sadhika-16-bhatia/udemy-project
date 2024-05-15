import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { response } from "express";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class EmailTaken implements AsyncValidator {
    constructor(private auth: AngularFireAuth){

    }
    validate = (control: AbstractControl<any, any>) : Promise<ValidationErrors | null> | Observable<ValidationErrors | null> =>{
       return this.auth.fetchSignInMethodsForEmail(control.value).then(
            response => response.length ? { emailTaken: true } : null

        );
      
    }
    registerOnValidatorChange?(fn: () => void): void {
        throw new Error("Method not implemented.");
    }
}
