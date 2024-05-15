import { AbstractControl , ValidationErrors, ValidatorFn} from "@angular/forms";

export class RegisterValidators {

   static match(controlName:string , matchingControl:string): ValidatorFn {
    return (group:AbstractControl) : ValidationErrors | null => {
        const control = group.get(controlName);
        const matchControl = group.get(matchingControl);
       // console.log(control);
        //console.log(matchControl);
    
        if(!control || !matchControl){
            console.error("FormControl not found ")
            return {controlNotFound:false}
        }
    
        const error = control.value === matchControl.value ?
        null :
        { noMatch : true}
            console.log(error);
            matchControl.setErrors(error);
            return error ;
       }
    }
   
}
