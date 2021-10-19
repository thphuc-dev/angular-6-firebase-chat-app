import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { RoleComponent } from './role.component';
import { RoleApiComponent } from './role-api/role-api.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Chức vụ và quyền'
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
        path: 'role-api/:id',
        component: RoleApiComponent,
        data: {
          title: 'Cập nhật quyền'
        }
      },
      {
        path: 'list',
        component: RoleComponent,
        data: {
          title: 'Danh sách'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
