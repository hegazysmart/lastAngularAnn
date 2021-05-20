import { HandleErrorService } from './../../../shared/services/handle-error.service';
import { ApisService } from './../../../shared/services/apis.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
})
export class AddUserComponent implements OnInit {

  userForm: FormGroup;
  editMode: boolean = false;
  hide: boolean = true;
  hide2: boolean = true;
  submitted: boolean = true;
  userID: any = '';

  constructor(private api: ApisService, private router: Router, private toaster: ToastrService, private route: ActivatedRoute, private handleError: HandleErrorService) {
    this.route.queryParams.subscribe(params => {
      this.editMode = params.editMode;
      this.userID = params.id;

    })
    let password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    let confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: password,
      password_confirmation: confirmPassword
    })
  }

  addUser(form: any) {
    if (!this.editMode) {
      this.api.POST('dashboard/users', form).subscribe((res: any) => {
        if (res.body.message) {
          this.submitted = false;
          this.toaster.success(form.name + ' has successfully created');
          setTimeout(() => {
            this.router.navigateByUrl('/users');
          }, 1000);
        }
      })
    } else if (this.editMode) {
      this.api.PUT('dashboard/users/' + this.userID, {
        name: this.userForm.controls.name.value,
        email: this.userForm.controls.email.value
      }).subscribe((res: any) => {
        if (res.body.data) {
          this.toaster.success(this.userForm.controls.name.value + ' has been updated successfully');
          setTimeout(() => {
            this.router.navigateByUrl('/users');
          }, 1000);
        }
      }, error => {
        this.handleError.handleError(error);
      })
    }
  }



  ngOnInit(): void {
    if (this.editMode) {
      // Get User By ID
      this.api.GET('dashboard/users/' + this.userID).subscribe((res: any) => {
        this.userForm.patchValue({
          name: res.body.data.name,
          email: res.body.data.email,
        });
        this.userForm.controls.password.disable();
        this.userForm.controls.password_confirmation.disable();
      })
    }
  }

}
