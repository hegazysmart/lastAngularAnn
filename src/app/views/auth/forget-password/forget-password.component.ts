import { ApisService } from './../../../shared/services/apis.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HandleErrorService } from 'src/app/shared/services/handle-error.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private api: ApisService, private toaster: ToastrService, private router: Router, private handleError: HandleErrorService) { }

  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  onForgetPassword(email: any) {
    this.api.POST('dashboard/forget-password', email).subscribe((res: any) => {
      if (res.body.message) {
        this.toaster.success(`<span class="text-capitalize">${res.body.message}</span>`);
        setTimeout(() => {
          this.router.navigateByUrl("/auth/check-email")
        }, 1000);
      }
    }, error => {
      this.handleError.handleError(error)
    })
  }

  ngOnInit(): void {
  }

}
