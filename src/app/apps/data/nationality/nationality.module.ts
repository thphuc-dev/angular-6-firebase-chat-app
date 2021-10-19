import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NationalityRoutingModule } from './nationality-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { NationalityComponent } from './nationality.component';
import { AddComponent } from './add/add.component';
import { RegionComponent } from './region/region.component';
import { AddRegionComponent } from './region/add-region/add-region.component';
import { DistrictComponent } from './district/district.component';
import { AddDistrictComponent } from './district/add-district/add-district.component';
import { WardComponent } from './ward/ward.component';
import { AddWardComponent } from './ward/add-ward/add-ward.component';
@NgModule({
  imports: [
    CommonModule,
    NationalityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
  ],
  declarations: [NationalityComponent, AddComponent, RegionComponent, AddRegionComponent, DistrictComponent, AddDistrictComponent, WardComponent, AddWardComponent ]
})
export class NationalityModule { }
