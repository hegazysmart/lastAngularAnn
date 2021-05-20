import { ApisService } from './../shared/services/apis.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(private observer: BreakpointObserver, private api: ApisService, private toater: ToastrService, private router: Router) { }

  user: any = '';

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout() {
    this.api.POST('dashboard/logout').subscribe((res: any) => {
      if (res.body.message) {
        this.toater.info('You are logout');
        setTimeout(() => {
          this.router.navigateByUrl('/auth');
        }, 1000);
      }
    })
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

}
