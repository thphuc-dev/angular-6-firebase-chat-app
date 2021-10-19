import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { StaffComponent } from './staff.component';
import { ProfileComponent } from './profile/profile.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Admin cơ sở'
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
        path: 'list',
        component: StaffComponent,
        data: {
          title: 'Danh sách'
        }
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'Thông tin cá nhân'
        }
      },
      {
        path: 'detail/:id',
        component: DetailComponent,
        data: {
          title: 'Thông tin cá nhân'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
