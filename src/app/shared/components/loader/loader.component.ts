import { DataShareService } from './../../services/data-shared.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
})
export class LoaderComponent implements OnInit {

  loader$: Observable<boolean> = this.dataShared.loader$.pipe(delay(0))

  constructor(private dataShared: DataShareService) { }

  ngOnInit(): void {
  }

}
