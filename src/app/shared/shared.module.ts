import { LoaderComponent } from './components/loader/loader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';




@NgModule({
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
  imports: [
    CommonModule,
    MatProgressBarModule
  ]
})
export class SharedModule { }
