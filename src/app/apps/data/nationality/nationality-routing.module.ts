import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { NationalityComponent } from './nationality.component';
import { RegionComponent } from './region/region.component';
import { AddRegionComponent } from './region/add-region/add-region.component';
import { DistrictComponent } from './district/district.component';
import { AddDistrictComponent } from './district/add-district/add-district.component';
import { WardComponent } from './ward/ward.component';
import { AddWardComponent } from './ward/add-ward/add-ward.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: '',
    data: {
      title: 'Quốc gia'
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
        component: NationalityComponent,
        data: {
          title: 'Danh sách'
        }
      },
      {
        path: ':nid/region/list',
        component: RegionComponent,
        data: {
          title: 'Danh sách tỉnh, thành phố'
        }
      },
      {
        path: ':nid/region/add',
        component: AddRegionComponent,
        data: {
          title: 'Thêm tỉnh, thành phố'
        }
      },
      {
        path: ':nid/region/add/:rid',
        component: AddRegionComponent,
        data: {
          title: 'Cập nhật tỉnh, thành phố'
        }
      },
      {
        path: ':nid/region/:rid/district/list',
        component: DistrictComponent,
        data: {
          title: 'Danh sách quận, huyện'
        }
      },
      {
        path: ':nid/region/:rid/district/add',
        component: AddDistrictComponent,
        data: {
          title: 'Thêm quận, huyện'
        }
      },
      {
        path: ':nid/region/:rid/district/add/:did',
        component: AddDistrictComponent,
        data: {
          title: 'Cập nhật quận, huyện'
        }
      },
      {
        path: ':nid/region/:rid/district/:did/ward/list',
        component: WardComponent,
        data: {
          title: 'Danh sách phường, xã'
        }
      },
      {
        path: ':nid/region/:rid/district/:did/ward/add',
        component: AddWardComponent,
        data: {
          title: 'Thêm phường, xã'
        }
      },
      {
        path: ':nid/region/:rid/district/:did/ward/add/:wid',
        component: AddWardComponent,
        data: {
          title: 'Cập nhật phường, xã'
        }
      },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NationalityRoutingModule { }
