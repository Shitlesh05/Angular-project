import { Component,OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  userForm !: FormGroup;
  actionBtn : string = "Submit Form"

  constructor(private formBuilder: FormBuilder , @Inject(MAT_DIALOG_DATA) public editData:any , 
    private dialogRef : MatDialogRef<DialogComponent> , 
    private api: ApiService ){}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      userName : ['',Validators.required],
      email : ['',Validators.required],
      phoneNumber : ['', [ Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10), Validators.maxLength(10)]],
      country : ['',Validators.required]
    });

    // this is for getting the data to edit for edit block
    if(this.editData){
      this.actionBtn = "Update";
      this.userForm.controls['userName'].setValue(this.editData.userName);
      this.userForm.controls['email'].setValue(this.editData.email);
      this.userForm.controls['phoneNumber'].setValue(this.editData.phoneNumber);
      this.userForm.controls['country'].setValue(this.editData.country);
    }


  }

  addUser()
  {
    if(!this.editData)
    {
      if(this.userForm.valid )
    {
      //localStorage.setItem(JSON.stringify(this.userForm.value.email),JSON.stringify(this.userForm.value))

      this.api.postUser(this.userForm.value)
      .subscribe({
        next:(res)=>{
          alert("User Data Added Successfully");
          this.userForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          alert("Error while adding User");
        }
      })
     }
    }
    else{
      this.updateUser();
    }
  }

  updateUser(){
    this.api.putUser(this.userForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("User updated Successfully");
        this.userForm.reset();
        this.dialogRef.close('update');
      },
      error:()=> {
        alert("Error while updating the Record....");
      },
    })
  }

}
