import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAnnouncementComponent } from './announcement.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'add',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Thông báo'
    },
    children: [
      {
        path: 'add',
        component: AddAnnouncementComponent,
        data: {
          title: 'Thêm'
        }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddAnnouncementRoutingModule { }
