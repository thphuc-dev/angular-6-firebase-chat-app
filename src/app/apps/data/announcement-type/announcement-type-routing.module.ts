import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { AnnouncementTypeComponent } from './announcement-type.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AddAnnouncementComponent } from './announcement/add/add.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Loại thông báo'
    },
    children: [
      {
        path: 'add',
        component: AddComponent,
        data: {
          title: 'Thêm'
        }
      },
      {
        path: 'add/:id',
        component: AddComponent,
        data: {
          title: 'Cập nhật'
        }
      },
      {
        path: 'list',
        component: AnnouncementTypeComponent,
        data: {
          title: 'Danh sách'
        }
      },
      {
        path: ':atid/announcement/list',
        component: AnnouncementComponent,
        data: {
          title: 'Danh sách thông báo'
        }
      },
      {
        path: ':atid/announcement/add',
        component: AddAnnouncementComponent,
        data: {
          title: 'Thêm thông báo'
        }
      },
      {
        path: ':atid/announcement/add/:id',
        component: AddAnnouncementComponent,
        data: {
          title: 'Cập nhật thông báo'
        }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementTypeRoutingModule { }
