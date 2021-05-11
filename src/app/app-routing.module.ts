import { AuthGuard } from './shared/guard/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard', loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users', loadChildren: () => import('./views/users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'pages', loadChildren: () => import('./views/pages/pages.module').then(m => m.PagesModule)
      },
    ]
  },
  {
    path: 'auth', loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
