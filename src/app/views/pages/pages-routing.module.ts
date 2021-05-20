import { ListComponent } from './list/list.component';
import { AddPageComponent } from './add-page/add-page.component';
import { BlukActionsComponent } from './bluk-actions/bluk-actions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'pages-list', pathMatch: 'full'
  },
  {
    path: 'pages-list', component: ListComponent
  },
  {
    path: 'bluk-actions', component: BlukActionsComponent,
  },
  {
    path: 'add-page', component: AddPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
