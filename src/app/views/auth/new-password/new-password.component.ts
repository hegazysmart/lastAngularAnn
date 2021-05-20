import { ApisService } from './../../../shared/services/apis.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { HandleErrorService } from 'src/app/shared/services/handle-error.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm: FormGroup;

  user: any = { token: '', email: '' }

  constructor(private route: ActivatedRoute, private api: ApisService, private router: Router, private toaster: ToastrService, private handleError: HandleErrorService) {

    this.route.queryParams.subscribe(params => {
      this.user.token = params.token;
      this.user.email = params.email;
    })

    let password = new FormControl('', [Validators.required, Validators.minLength(6)]);
    let confirmPassword = new FormControl('', CustomValidators.equalTo(password));
    this.newPasswordForm = new FormGroup({
      password: password,
      confirmPassword: confirmPassword
    })
  }

  onNewPassword() {
    this.api.POST("dashboard/reset-password", {
      email: this.user.email,
      token: this.user.token,
      password: this.newPasswordForm.controls.password.value,
      password_confirmation: this.newPasswordForm.controls.confirmPassword.value,
    }).subscribe((res: any) => {
      this.toaster.success(res.body.message)
    }, error => {
      this.handleError.handleError(error)
    })
  }

  ngOnInit(): void {
  }

}
