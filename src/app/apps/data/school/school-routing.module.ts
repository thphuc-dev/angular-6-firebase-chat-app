import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { SchoolComponent } from './school.component';
import { MajorComponent } from './major/major.component';
import { AddMajorComponent } from './major/add-major/add-major.component';
import { ClassComponent } from './class/class.component';
import { AddClassComponent } from './class/add-class/add-class.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Trường'
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
        component: SchoolComponent,
        data: {
          title: 'Danh sách'
        }
      },
      {
        path: ':sid/major/list',
        component: MajorComponent,
        data: {
          title: 'Danh sách khoa'
        }
      },
      {
        path: ':sid/major/add',
        component: AddMajorComponent,
        data: {
          title: 'Thêm khoa'
        }
      },
      {
        path: ':sid/major/add/:mid',
        component: AddMajorComponent,
        data: {
          title: 'Cập nhật khoa'
        }
      },
      {
        path: ':sid/major/:mid/class/list',
        component: ClassComponent,
        data: {
          title: 'Danh sách lớp'
        }
      },
      {
        path: ':sid/major/:mid/class/add',
        component: AddClassComponent,
        data: {
          title: 'Thêm lớp'
        }
      },
      {
        path: ':sid/major/:mid/class/add/:cid',
        component: AddClassComponent,
        data: {
          title: 'Cập nhật lớp'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
