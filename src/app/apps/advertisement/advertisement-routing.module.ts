import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { AdvertisementComponent } from './advertisement.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Quảng cáo'
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
        component: AdvertisementComponent,
        data: {
          title: 'Danh sách'
        }
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvertisementRoutingModule { }
