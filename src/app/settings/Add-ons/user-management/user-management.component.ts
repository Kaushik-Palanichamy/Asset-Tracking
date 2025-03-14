import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { SettingsService } from '../service/settings.service';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormControl,FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { faCheck, faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  @Input() userData: any
  check = faCheck

userManagement: any;
Addform: FormGroup;

selectedUser = ''
dropdown: any;

value!: string;

display: boolean = false;

endpoint="usermanagement/data"
show:boolean=true;
passwordRequirements = {
  lowercase: false,
  uppercase: false,
  numeric: false,
  length: false
};

close = faCircleXmark

constructor( private cdr: ChangeDetectorRef ,private Cookie: CookieService, private confirmation: ConfirmationService ,private service: SettingsService,private http: HttpClient,private fb:FormBuilder, private messageService: MessageService, private router: Router, private authService: AuthService)
{
  // this.show = true
  // this.service.getData(this.endpoint).subscribe(res =>{
    // this.show = false
    // this.userManagement = res
    // console.log("UM",res)
  // });


  this.Addform= this.fb.group({
   udusercode  : ["",Validators.required],
   udusername  : ["", Validators.required],
   udfirstName : ["", Validators.required],
   udlastName  : ["", Validators.required],
   udaddress1  : ["", Validators.required],
   udaddress2  : ["", Validators.required],
   udemail: new FormControl('', [Validators.required, Validators.email, this.customEmailValidator(), Validators.maxLength(255)]),
   udtype      : new FormControl('', Validators.required),
   udpassword: [
    '',
    [
      Validators.required,
      this.passwordStrengthValidator.bind(this)
    ]
  ],
  udconfirmpassword: ['', Validators.required],
  udlanguage: ["", Validators.required],
}, { validators: this.passwordMatchValidator });

this.dropdown = [
  {name: 'Base Admin', code: 'Base Admin'},
  {name: 'User', code: 'User'},
];

}

// Custom Email Validator
customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const emailPattern = /^[^\s@]+@motherson\.com$/;
    const valid = emailPattern.test(control.value);
    return valid ? null : { invalidEmail: true };
  };
}


passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('udpassword')?.value;
  const confirmPassword = control.get('udconfirmpassword')?.value;

  // Return null if both fields are empty (i.e., no error)
  if (!password && !confirmPassword) {
    return null;
  }

  // If confirmPassword is filled but password is empty
  if (!password && confirmPassword) {
    return { passwordFirst: true };
  }

  // If both are filled and don't match
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }

  // Return null if they match (i.e., no error)
  return null;
}

// passwordMatchValidator(formGroup: FormGroup) {
//   const password = formGroup.get('udpassword')?.value;
//   const confirmPassword = formGroup.get('udconfirmpassword')?.value;
//   return password === confirmPassword ? null : { passwordMismatch: true };
// }

// passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
//   const password = control.get('udpassword')?.value;
//   const confirmPassword = control.get('udconfirmpassword')?.value;
//   if (password && confirmPassword && password !== confirmPassword) {
//     return { passwordMismatch: true };
//   }
//   return null;
// }

checkPassword() {
  const password = this.value;
  this.passwordRequirements.lowercase = /[a-z]/.test(password);
  this.passwordRequirements.uppercase = /[A-Z]/.test(password);
  this.passwordRequirements.numeric = /[0-9]/.test(password);
  this.passwordRequirements.length = password.length >= 8;
  this.Addform.updateValueAndValidity();
}

passwordStrengthValidator(control: any) {
  const value = control.value || '';
  this.passwordRequirements.lowercase = /[a-z]/.test(value);
  this.passwordRequirements.uppercase = /[A-Z]/.test(value);
  this.passwordRequirements.numeric = /[0-9]/.test(value);
  this.passwordRequirements.length = value.length >= 8;

  const isValid = this.passwordRequirements.lowercase &&
                  this.passwordRequirements.uppercase &&
                  this.passwordRequirements.numeric &&
                  this.passwordRequirements.length;

  return isValid ? null : { passwordInvalid: true };
}

onPasswordChange() {
  this.Addform.get('udpassword')?.updateValueAndValidity();
}

onConfirmPasswordBlur() {
  const password = this.Addform.get('udpassword');
  const confirmPassword = this.Addform.get('udconfirmpassword');

  // Trigger validation manually when the user clicks outside
  if (password?.touched && confirmPassword?.touched) {
    password.updateValueAndValidity();
    confirmPassword.updateValueAndValidity();
  }
}

currentUserType: string = '';

ngOnInit(){

  this.currentUserType = this.Cookie.get('type')
  // this.cdr.detectChanges();
  // console.log('udtypes',this.currentUserType)

}




selected: any = [];
ModalType = 'ADD'

ngOnChanges():void{

this.userManagement = this.userData

  if(this.selected){
    this.Addform.patchValue(this.selected)
    this.currentUserType = this.Cookie.get('type')
    // console.log('udtypes',this.currentUserType)
    this.ModalType = 'UPDATE'
  }
  else{
    this.Addform.reset();
    this.ModalType = 'ADD'
  }
}

codeEndpoint = "uscode"
code: any;

showDialog(){
  this.display = true;
  this.Addform.reset()
  this.selectedData = null
   this.ModalType = 'ADD'

  this.service.getData(this.codeEndpoint).subscribe(
    res =>{
    this.code = res.udusercode

    this.Addform.get('udusercode')?.setValue(this.code)
    this.Addform.controls['udusercode'].setValue(this.code);
  },
  error => {
    this.closeModal()
    this.messageService.add({ severity: 'error', summary: 'Code Not Generated', detail: 'Failed', life: 5000 });
    console.log("Error")
  }
)
}


displayDialog: boolean = false;

onUserTypeChange(event: any) {
  const newType = event.value;
  if (this.selectedData && this.selectedData.udtype === 'Base Admin' && newType === 'User') {
    this.displayDialog = true;
  }

}

onDialogYes() {

  this.displayDialog = false;
  // this.currentUserType = 'User';

}



onDialogNo() {

  this.Addform.get('udtype')?.setValue(this.selectedData?.udtype);
  this.displayDialog = false;
}

editRow(i:any){

  this.selectedData = i;
  this.display = true;
  this.Addform.patchValue(this.selectedData)
  this.ModalType = 'UPDATE'
}

// SavaData(Data:any){
//   this.userManagement.push(Data)
// }

// Update(Update:any){
//   const i = this.userManagement.findIndex((user:any) => user.udusercode === this.selectedData.udusercode);
//   this.userManagement[i] = Update;
// }

closeModal(){
  this.Addform.reset();
  this.display = false
}

Loadtable(){
  this.closeModal()
  this.show = true
  this.service.getData('usermanagement/data').subscribe((data: any[])  =>{
    this.show = false
    this.userManagement = data

  });
}

resetCheckbox(){
  this.selected = []
}

OnSubmit(){
    // Ensure the form is valid before proceeding
    if (this.Addform.invalid) {
      this.Addform.markAllAsTouched();
      return;
    }

    // Check for password mismatch before proceeding
    const password = this.Addform.get('udpassword')?.value;
    const confirmPassword = this.Addform.get('udconfirmpassword')?.value;

    if (password !== confirmPassword) {
      this.Addform.setErrors({ passwordMismatch: true });
      return;
    } else {
      this.Addform.setErrors(null); // Clear any existing password mismatch errors
    }

    // Proceed with the respective operations based on the ModalType
  // this.Addform.controls['udusercode'].setValue(this.code);

  if(this.ModalType==='UPDATE'){
    this.OnUpdate();

    // this.Loadtable()
  }
  else{
    this.OnSave(this.Addform.value);

  }

}
mailError: any;

// OnSave(form:any){
//   if (this.Addform.valid) {
//     this.service.postData(this.endpoint,this.Addform.value).subscribe(
//       response =>{

//         // this.SavaData(form)
//         this.Loadtable()
//         this.Addform.reset();
//         this.closeModal();
//         this.messageService.add({ severity: 'success', summary: 'Added', detail:'Sucessfully', life: 4000 });
//       },
//       error => {
//         if (error.error && error.error.email) {
//           this.mailError = error.error.email;
//         }
//         else {
//          this.messageService.add({ severity: 'error', summary: 'Failed to Add', detail: 'Failed', life: 4000 });
//         console.log("Error")
//         }

//       }
//     )
//   }
// }

duplicateEmailError: string | null = null

OnSave(form: any) {
  if (this.Addform.valid) {
    this.service.postData(this.endpoint, this.Addform.value).subscribe(
      response => {
        // On successful save, reset the form, reload the table, and close the modal
        this.Loadtable();
        this.Addform.reset();
        this.closeModal();
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Added', 
          detail: 'Successfully added', 
          life: 4000 
        });
      },
      error => {
        // Handle duplicate email error from the server
        if (error.status === 404 && error.error) { 
          this.Addform.controls['udemail'].setErrors({ duplicateEmail: true });
          this.duplicateEmailError = "Email Id already exists"; 
        } else {
          
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Failed to Add', 
            detail: 'Failed to add data', 
            life: 4000 
          });
          console.error("Error:", error);
        }
      }
    );
  } else {
  
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Validation Error', 
      detail: 'Please fill in the required fields.', 
      life: 4000 
    });
  }
}


OnUpdate(){
  if(this.selected){
    this.service.putData(this.endpoint, this.Addform.value).subscribe(
      update =>{

        this.Loadtable()
        // this.Update(this.Addform.value)
        this.closeModal();
        this.messageService.add({ severity: 'info', summary: 'Updated', detail:'Sucessfully updated', life: 4000 });
      },
      error => {
      
        if (error.status === 404 && error.error) { 
          this.Addform.controls['udemail'].setErrors({ duplicateEmail: true });
          this.duplicateEmailError = "Email Id already exists"; 
        } else {
          
          // this.messageService.add({ 
          //   severity: 'error', 
          //   summary: 'Failed to Add', 
          //   detail: 'Failed to add data', 
          //   life: 4000 
          // });
          console.error("Error:", error);
        }
      }
    );
  } else {
        this.messageService.add({ 
          severity: 'error',
          summary: 'Not Updated', 
          detail: 'Failed', 
          life: 4000 
        });
        console.log("Error")
      }
  
}


selectedData: any = null


  deleteRow() {
    if (this.selected.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'No Selection', detail: 'Please select at least one row to delete.', life: 4000 });
      return;
    }

    this.confirmation.confirm({
      message: 'Are you sure, you want to delete the selected User?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",
      accept: () => {
        this.DeleteData();
      }
    });

  }

  DeleteData() {

    let currUser = false;

  const codesToDelete = this.selected.map((item:any) => item.udusercode);


  codesToDelete.forEach((code: any) => {
    const user = this.selected.find((item: any) => item.udusercode === code);
    const name = user ? user.udusername : '';

    this.service.deleteData(this.endpoint, code).subscribe(
      () => {

        this.userManagement = this.userManagement.filter((user: any) => user.udusercode !== code);

        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `${name} - Successfully deleted`,
          life: 4000
        });


        if (name === this.Cookie.get('username')) {
          currUser = true;
          this.Cookie.deleteAll();
          this.router.navigate(['/']);
          this.authService.logout();
        }
      },
      error => {

        this.messageService.add({
          severity: 'error',
          summary: 'Not Deleted',
          detail: `${name} - Failed to delete`,
          life: 4000
        });
        console.error(`Error deleting item with code ${code}:`, error);
      }
    );
  });

  this.selected = [];

  // if (currUser) {

  // }
}



}


