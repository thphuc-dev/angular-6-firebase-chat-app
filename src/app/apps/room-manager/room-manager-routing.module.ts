import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomManagerComponent } from './room-manager.component';
import { ReservationComponent } from './reservation/reservation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Quản lý phòng'
    },
    children: [
      {
        path: 'reservation',
        component: ReservationComponent,
        data: {
          title: 'Xếp phòng'
        }
      },
      {
        path: 'list',
        component: RoomManagerComponent,
        data: {
          title: 'Danh sách phòng'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoomManagerRoutingModule { }
