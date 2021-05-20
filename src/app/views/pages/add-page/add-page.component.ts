import { HandleErrorService } from './../../../shared/services/handle-error.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ApisService } from './../../../shared/services/apis.service';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import * as moment from 'moment';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { CdkDragDrop, copyArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',

})
export class AddPageComponent implements OnInit {
  @ViewChild('picker') picker: any;
  @ViewChild('removableInput') removableInput: any;
  @ViewChild('removableBG') removableBG: any;

  public files: NgxFileDropEntry[] = [];

  pageID: any = '';
  editMode: boolean = false;
  item$: Observable<any[]>;

  constructor(private api: ApisService, private toaster: ToastrService, private zone: NgZone, private router: Router, private fb: FormBuilder, private route: ActivatedRoute, private handleError: HandleErrorService, private firestore: AngularFirestore) {
    this.item$ = firestore.collection('announcement').valueChanges();
    console.log(this.item$.subscribe(res => {
      console.log(res);
    }));
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.pageID = params.id;
      this.editMode = params.editMode;
      // Get Page Details
      this.api.GET('dashboard/pages/' + params.id).subscribe(res => {
        console.log(res.body['data']);
        let page = res.body['data'];
        this.pageForm.patchValue({
          name: page.name,
          expiry_at: page.expiry_at
        })
        this.bgSRC = page.background;
        this.mediaType = page.type_id;
        this.isPublished = false;
        if (page.type_id === 1) {
          this.imgSRC[0] = page.url;
        } else {
          this.videoSRC[0] = page.url;
        }
      })
    })
  }
  gallery = ['https://images.ctfassets.net/hrltx12pl8hq/4plHDVeTkWuFMihxQnzBSb/aea2f06d675c3d710d095306e377382f/shutterstock_554314555_copy.jpg',
    'https://www.publicdomainpictures.net/pictures/320000/velka/background-image.png'];
  progress: number = 0;

  bgSRC: any = '';
  imgSRC: any = [];
  videoSRC: any = [];
  isPublished: boolean = true;
  mediaType: any = '';

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
  startDate = moment();

  errorMediaMSG: boolean = false;
  errorBGMSG: boolean = false;

  pageForm = this.fb.group({
    background: [''],
    name: ['', Validators.required],
    expiry_at: ['', Validators.required],
    media: ['', Validators.required],
  })

  ngOnInit(): void { }


  // Upload Background Image
  uploadBackground(event: any) {
    const file: File = event.target.files[0];
    this.errorBGMSG = false;
    const file_reader = new FileReader();
    file_reader.readAsDataURL(event.target.files[0]);
    file_reader.onload = (event) => {
      this.bgSRC = event.target?.result;
    }
  }

  // Remove Background Image
  removeBG() {
    this.bgSRC = '';
    this.pageForm.controls.background.setValue('');
  }

  // Upload Media
  uploadDocument(event: any) {
    const file: File = event.target.files[0];
    this.errorMediaMSG = false;
    const file_reader = new FileReader();
    file_reader.readAsDataURL(event.target.files[0]);
    file_reader.onload = (event) => {
      this.mediaType = file.type.includes('image') ? 1 : 2;
      if (file.type.includes('image')) {
        this.imgSRC[0] = event.target?.result;
      } else {
        this.videoSRC[0] = event.target?.result;
      }
    }
  }

  // Remove Media
  removeMedia() {
    this.imgSRC = [];
    this.videoSRC = [];
    this.pageForm.controls.media.setValue('');
  }

  // Save Page
  savePage(form) {
    this.isPublished = false;
    this.submitOnePage(form);
  }

  // Publish Page
  publishPage(form) {
    this.isPublished = true;
    this.submitOnePage(form);
  }


  // Save Page
  editSavePage(form) {
    this.isPublished = false;
    this.editPage(form);
  }

  // Publish Page
  editPublishPage(form) {
    this.isPublished = true;
    this.editPage(form);
  }

  // Update Page
  editPage(form) {
    this.firestore.collection('announcement').doc('tVJPiWUj7rMqlSYiwy9d').set({ pageID: this.pageID })
    const formData = new FormData();
    formData.append('name', this.pageForm.get('name').value);
    formData.append("background", this.pageForm.get('background').value ? this.pageForm.get('background').value : '');
    // Publish
    formData.append("status", this.isPublished ? '1' : '0');
    formData.append("type_id", this.mediaType);
    formData.append("media", this.pageForm.get('media').value);
    formData.append("expiry_at", this.pageForm.get('expiry_at').value);
    formData.append("_method", 'put');
    console.log(form);
    this.api.POST('dashboard/pages/' + this.pageID, formData).subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.toaster.success('Page is successfully updated !');
        this.router.navigateByUrl('/pages');
      }, 1000);
    }, error => {
      this.handleError.handleError(error);
    })
  }
  // Submit
  submitOnePage(form) {
    const formData = new FormData();
    formData.append('name', this.pageForm.get('name').value);
    formData.append("background", this.pageForm.get('background').value ? this.pageForm.get('background').value : 'https://image.freepik.com/free-vector/white-blurred-background_1034-249.jpg');
    // Publish
    formData.append("status", this.isPublished ? '1' : '0');
    formData.append("type_id", this.mediaType);
    formData.append("media", this.pageForm.get('media').value);
    formData.append("expiry_at", this.pageForm.get('expiry_at').value);
    console.log(form);
    this.api.POST('dashboard/pages', formData).subscribe(res => {
      console.log(res);
      setTimeout(() => {
        this.toaster.success('Page is successfully created !');
        this.router.navigateByUrl('/pages');
      }, 1000);
    }, error => {
      this.handleError.handleError(error)
    })
  }

  // Drop
  drop(event: CdkDragDrop<string[]>) {
    console.log(event.container.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      event.container.data.splice(0, 1);
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.imgSRC = event.container.data;
    console.log(event.container.data);
    console.log(this.imgSRC);
  }
}
