import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { PriorityTargetComponent } from './priority-target.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Đối tượng ưu tiên'
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
        component: PriorityTargetComponent,
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
export class PriorityTargetRoutingModule { }
