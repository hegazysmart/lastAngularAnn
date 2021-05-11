import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent implements OnInit {

  @ViewChild('picker') picker: any;
  @ViewChild('removableInput') removableInput: any;
  @ViewChild('removableBG') removableBG: any;

  pagesNumber: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  pageForm: FormGroup;
  pages: FormArray;
  progress: number = 0;
  imgSRC: any = [];
  videoSRC: any = [];
  bgSRC: any = [];

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

  public formGroup = new FormGroup({
    date: new FormControl(null, [Validators.required]),
  })

  constructor(private http: HttpClient, private fb: FormBuilder, private zone: NgZone) {
    this.pageForm = this.fb.group({
      pages: this.fb.array([this.createPage()])
    })
    this.pages = this.pageForm.get('pages') as FormArray;
  }

  get pageFormArray() {
    return this.pageForm.get('pages') as FormArray;
  }

  addItem(): void {
    this.pages = this.pageForm.get('pages') as FormArray;
    this.pages.push(this.createPage());
    console.log(this.pageForm.controls.pages.value);
    this.editTime();
  }

  editTime() {
    const valuesArray = this.pageForm.controls.pages.value.map((ele: any) => {
      ele.duration = ele.duration.toString().split(' (')[0];
      return ele
    });
    console.log(valuesArray);
  }

  createPage(): FormGroup {
    return this.fb.group({
      name: '',
      backgroundURL: '',
      media_type: '',
      duration: '',
      media: ''
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
      this.bgSRC[i] = event.target?.result;
    }
    // if (file) {
    //   this.fileName = file.name;
    //   const formData = new FormData();
    //   formData.append("thumbnail", file);
    //   console.log(formData);
    //   const upload$ = this.http.post("/api/thumbnail-upload", formData);
    //   upload$.subscribe();
    // }
  }

  removeBG(i: any) {
    this.pageForm.controls.pages.value[i].backgroundURL = '';
    this.bgSRC[i] = '';
    this.removableBG._elementRef.nativeElement.children[0].value = null;
  }

  uploadDocument(event: any, i: any) {
    console.log(event.target.files[0]);
    const file: File = event.target.files[0];
    const file_reader = new FileReader();
    file_reader.readAsDataURL(event.target.files[0]);
    file_reader.onload = (event) => {
      console.log(event.target?.result);
      if (file.type.includes('image')) {
        this.imgSRC[i] = event.target?.result;
      } else {
        this.videoSRC[i] = event.target?.result;
      }
    }
  }

  // Upload Image or Video Content
  onUploadMedia(event: any, i: any) {
    console.log(i);
    const file: File = event.target.files[0];
    const file_reader = new FileReader();
    file_reader.readAsDataURL(event.target.files[0]);
    file_reader.onload = (event) => {
      this.pageForm.controls.pages.value[i].backgroundURL = event.target?.result;
    }

    // const file: File = event.target.files[0];
    console.log(file);
    this.pageForm.controls.pages.value[i].media_type = file.type;
    if (file) {
      const formData = new FormData();
      formData.append("thumbnail", file);
      console.log(formData);
      setTimeout(() => {
        console.log(this.pageForm.controls.pages.value[i]);
        const upload$ = this.http.post("", {
          name: this.pageForm.controls.pages.value[i].name.value,
          backgroundURL: this.pageForm.controls.pages.value[i].backgroundURL.value,
          media_type: this.pageForm.controls.pages.value[i].media_type.value,
          duration: this.pageForm.controls.pages.value[i].duration.value,
          media: formData
        }, {
          reportProgress: true,
          observe: 'events'
        });
        upload$.subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              const total: number = event.total;
              this.progress = Math.round(100 * event.loaded / total)
            }
          } else if (event.type === HttpEventType.Response) {
            console.log(event);
          }
          // Object Data Request
        });
      }, 1500);
    }
  }

  removeMediaFunction(i: any) {
    this.pageForm.controls.pages.value[i].media = '';
    this.removableInput._elementRef.nativeElement.children[0].value = null;
    this.imgSRC[i] = this.videoSRC[i] = '';
  }

  removePage(i: any) {
    console.log(i);

    this.pages.removeAt(i);
  }
  ngOnInit(): void { }
}
