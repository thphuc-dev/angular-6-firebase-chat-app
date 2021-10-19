import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { AddPersonalBillComponent } from './personal/add/add.component';
import { SharedComponent } from './shared/shared.component';
import { AddSharedBillComponent } from './shared/add/add.component';
import { EditPersonalBillComponent } from './personal/edit/edit.component';
import { EditSharedBillComponent } from './shared/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'personal',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Thanh toán'
    },
    children: [
      {
        path: 'personal',
        component: PersonalComponent,
        data: {
          title: 'Thu tiền phòng'
        }
      },
      {
        path: 'personal/add',
        component: AddPersonalBillComponent,
        data: {
          title: 'Thêm hoá đơn phí phòng'
        }
      },
      {
        path: 'personal/edit/:id',
        component: EditPersonalBillComponent,
        data: {
          title: 'Cập nhật hoá đơn phí phòng'
        }
      },
      {
        path: 'shared',
        component: SharedComponent,
        data: {
          title: 'Thu tiền dịch vụ'
        }
      },
      {
        path: 'shared/add',
        component: AddSharedBillComponent,
        data: {
          title: 'Thêm hoá đơn phí dịch vụ'
        }
      },
      {
        path: 'shared/edit/:id',
        component: EditSharedBillComponent,
        data: {
          title: 'Cập nhật hoá đơn phí dịch vụ'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillRoutingModule { }
