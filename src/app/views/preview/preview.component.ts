import { ApisService } from './../../shared/services/apis.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
})
export class PreviewComponent implements OnInit {

  pageID: any = '';
  page: any = '';

  parseDate: any = '';
  today: any = '';

  constructor(private route: ActivatedRoute, private api: ApisService) {

    // Get Preview Page Details
    this.route.queryParams.subscribe(params => {
      this.pageID = params.id;
      this.api.GET('dashboard/pages/' + params.id).subscribe(res => {
        this.page = res.body['data']
        // Parse expiry date to numbers
        this.parseDate = Date.parse(this.page.expiry_at);
        // Parse today date to numbers
        this.today = moment();
        // Validation
        if (this.parseDate <= (Date.parse(this.today))) {
          Swal.fire({
            title: 'Media content is expired',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
        }
      })
    })
  }

  ngOnInit(): void {
  }

}
