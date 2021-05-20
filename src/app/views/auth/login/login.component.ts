import { HandleErrorService } from './../../../shared/services/handle-error.service';
import { ApisService } from './../../../shared/services/apis.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  constructor(private toaster: ToastrService, private api: ApisService, private router: Router, private handleError: HandleErrorService) { }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('admin@admin.com', [Validators.required, Validators.email]),
    password: new FormControl('123456', [Validators.required, Validators.minLength(6)])
  })


  onLogin(form: any) {
    this.api.POST('dashboard/login', form).subscribe((res: any) => {
      if (res.body.data.token) {
        this.toaster.success(`<span class="text-capitalize">Welcome ${res.body.data.user.name}</span>`)
        localStorage.setItem('token', res.body.data.token.access_token);
        localStorage.setItem('user', JSON.stringify(res.body.data.user));
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard')
        }, 1000);
      }
    }, error => {
      this.handleError.handleError(error)
    })
  }

  ngOnInit(): void {
  }

}
