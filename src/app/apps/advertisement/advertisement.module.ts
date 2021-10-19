import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementRoutingModule } from './advertisement-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { AdvertisementComponent } from './advertisement.component';
import { AddComponent } from './add/add.component';
@NgModule({
  imports: [
    CommonModule,
    AdvertisementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
  ],
  declarations: [AdvertisementComponent, AddComponent]
})
export class AdvertisementModule { }
