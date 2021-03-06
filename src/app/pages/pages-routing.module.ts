import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { p404Component } from './404.component';
import { p500Component } from './500.component';
import { LoginLauncherComponent } from './login-launcher/login-launcher.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '404',
    data: {
      title: 'Page 404'
    },
    component: p404Component
  },
  {
    path: '500',
    component: p500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginLauncherComponent,
    data: {
      title: 'Login Page'
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
