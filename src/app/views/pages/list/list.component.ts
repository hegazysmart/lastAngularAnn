import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ApisService } from './../../../shared/services/apis.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  // DatePicker
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  items: any;
  p: number = 1;
  pages: any = [];
  backUpPages: any = [];
  dateControl = new FormControl();
  filterDate: any = '';
  item$: Observable<any[]>;

  constructor(private api: ApisService, private router: Router, private toaster: ToastrService, private firestore: AngularFirestore) {
    this.item$ = firestore.collection('announcement').snapshotChanges();
    console.log(this.item$.subscribe(res => {
      console.log(res);
      this.getPages();
    }));
  }

  ngOnInit(): void {
    this.getPages();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.pages = this.backUpPages;
    this.pages = this.pages.filter(page => {
      if (filterValue != '' || filterValue != undefined) {
        if (page.name.toLowerCase().trim().includes(filterValue.toLocaleLowerCase().trim())) {
          return page;
        } else {
          this.pages = this.backUpPages;
        }
      } else {
        this.pages = this.backUpPages;
      }
    });
    console.log(this.pages);
  }

  getPages() {
    this.api.GET('dashboard/pages').subscribe(res => {
      this.pages = res.body['data'];
      console.log(this.pages);
      this.backUpPages = this.pages;
    })
  }

  // Publish page
  publishPage(page) {
    console.log(page);
    this.api.POST('dashboard/pages/' + page.id).subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.toaster.success('Page is successfully published !');
        this.getPages();
      }, 1000);
    })
  }

  // Delete
  deletePage(page) {
    Swal.fire({
      title: `Are you sure you want to delete ${page.name} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8263FF',
      cancelButtonColor: '#5b6e88',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.DELETE('dashboard/pages/' + page.id).subscribe((res: any) => {
          if (res.body.message) {
            this.toaster.info(`${page.name} has been deleted`);
            this.getPages();
          }
        })
      }
    })
  }
}
