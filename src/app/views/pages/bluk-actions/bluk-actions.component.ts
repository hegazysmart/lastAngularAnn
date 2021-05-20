import { HandleErrorService } from './../../../shared/services/handle-error.service';
import { DataShareService } from './../../../shared/services/data-shared.service';
import { Data, Router } from '@angular/router';
import { ApisService } from './../../../shared/services/apis.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bluk-actions',
  templateUrl: './bluk-actions.component.html',
})
export class BlukActionsComponent implements OnInit {

  @ViewChild('picker') picker: any;


  pagesNumber: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  pageForm: FormGroup;
  pages: FormArray;
  progress: number = 0;
  bgSRC: any = '';

  startDate = moment();

  isPublished: boolean = true;

  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public dateControl = new FormControl('');


  constructor(private api: ApisService, private toaster: ToastrService, private fb: FormBuilder, private zone: NgZone, private router: Router, private handleError: HandleErrorService) {
    this.pageForm = this.fb.group({
      pages: this.fb.array([this.createPage()])
    })
    this.pages = this.pageForm.get('pages') as FormArray;
  }

  ngOnInit(): void { }

  get pageFormArray() {
    return this.pageForm.get('pages') as FormArray;
  }

  addItem(): void {
    this.pages = this.pageForm.get('pages') as FormArray;
    this.pages.push(this.createPage());
    this.editTime();
  }

  editTime() {
    const valuesArray = this.pageForm.controls.pages.value.map((ele: any) => {
      ele.expiry_at = ele.expiry_at.toString().split(' (')[0];
      return ele
    });
  }

  createPage(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      background: '',
      backgroundURL: '',
      type_id: '',
      expiry_at: ['', Validators.required],
      media: ['', Validators.required],
      mediaURL: '',
      status: '',
      hasError: false,
      isVideo: false
    });
  }

  addNewPage() {
    this.pages = this.pageForm.get('pages') as FormArray;
    this.pages.push(this.createPage());
  }

  uploadBackground(event: any, i: any) {
    const file: File = event.target.files[0];
    const file_reader = new FileReader();
    file_reader.readAsDataURL(event.target.files[0]);
    file_reader.onload = (event) => {
      // this.bgSRC[i] = event.target?.result;
      this.pageForm.controls.pages.value[i].backgroundURL = event.target?.result;
      this.bgSRC = event.target?.result;

    }
  }

  removeBG(i: any) {
    console.log('ENTERED');
    this.pageForm.controls.pages.value[i].background = '';
    this.pageForm.controls.pages.value[i].backgroundURL = '';
  }

  uploadDocument(event: any, i: any) {
    const file: File = event.target.files[0];
    const file_reader = new FileReader();
    file_reader.readAsDataURL(event.target.files[0]);
    file_reader.onload = (event) => {
      this.pageForm.controls.pages.value[i].type_id = file.type.includes('image') ? 1 : 2;
      this.pageForm.controls.pages.value[i].mediaURL = event.target?.result;
      this.pageForm.controls.pages.value[i].backgroundURL = this.bgSRC;
      if (!file.type.includes('image')) {
        this.pageForm.controls.pages.value[i].isVideo = true;
      }
    }
  }
  // Remove Media
  removeMedia(i: any) {
    this.pageForm.controls.pages.value[i].media = '';
    this.pageForm.controls.pages.value[i].mediaURL = '';
  }


  // Remove Page
  removePage(i) {
    const control = <FormArray>this.pageForm.controls['pages'];
    control.removeAt(i)
  }

  // Save Page
  savePage() {
    this.isPublished = false;
    this.submitOnePage();
  }

  // Publish Page
  publishPage() {
    this.isPublished = true;
    this.submitOnePage();
  }
  // Submit
  submitOnePage() {
    let subscribeMethod = (formData, i) => {
      return this.api.POST('dashboard/pages', formData).subscribe(res => {
        console.log(res);
        setTimeout(() => {
          this.toaster.success('Page is successfully created !');
          this.router.navigateByUrl("/pages");
        }, 1000);
      }, error => {
        subscribeMethod(formData, i).unsubscribe()
        this.handleError.handleError(error);
        this.pageForm.controls.pages.value[i].hasError = true;
      });
    }
    for (let i = 0; i < this.pageForm.controls.pages.value.length; i++) {
      const formData = new FormData();
      formData.append('name', this.pageForm.controls.pages.value[i].name);
      formData.append('background', this.pageForm.controls.pages.value[i].background);
      formData.append('status', this.isPublished ? '1' : '0');
      formData.append('type_id', this.pageForm.controls.pages.value[i].type_id);
      formData.append('media', this.pageForm.controls.pages.value[i].media);
      formData.append('expiry_at', this.pageForm.controls.pages.value[i].expiry_at);
      subscribeMethod(formData, i)
    }
  }
  // Send Request with the only failed page
  tryAgain(i) {
    console.log(i);
    const formData = new FormData();
    formData.append('name', this.pageForm.controls.pages.value[i].name);
    formData.append('background', this.pageForm.controls.pages.value[i].background);
    formData.append('status', this.isPublished ? '1' : '0');
    formData.append('type_id', this.pageForm.controls.pages.value[i].type_id);
    formData.append('media', this.pageForm.controls.pages.value[i].media);
    formData.append('expiry_at', this.pageForm.controls.pages.value[i].expiry_at);
    this.api.POST('dashboard/pages', formData).subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.toaster.success('Page is successfully created !');
        this.router.navigateByUrl("/pages");
      }, 1000);
    }, error => {
      this.handleError.handleError(error);
      this.pageForm.controls.pages.value[i].hasError = true;
    });
  }
}
