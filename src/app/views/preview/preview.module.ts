import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewComponent } from './preview.component';


@NgModule({
  declarations: [
    PreviewComponent
  ],
  imports: [
    CommonModule,
    PreviewRoutingModule
  ]
})
export class PreviewModule { }
