import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { BuildingComponent } from './building.component';
import { RoomComponent } from './room/room.component';
import { AddRoomComponent } from './room/add-room/add-room.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Tòa nhà'
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
        component: BuildingComponent,
        data: {
          title: 'Danh sách'
        }
      },
      {
        path: ':bid/room/list',
        component: RoomComponent,
        data: {
          title: 'Danh sách phòng'
        }
      },
      {
        path: ':bid/room/add',
        component: AddRoomComponent,
        data: {
          title: 'Thêm phòng'
        }
      },
      {
        path: ':bid/room/add/:rid',
        component: AddRoomComponent,
        data: {
          title: 'Cập nhật phòng'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingRoutingModule { }
