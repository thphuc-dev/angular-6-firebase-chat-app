import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { RegionComponent } from './region.component';
import { AddRegionComponent } from './add-region/add-region.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
  ],
  declarations: [RegionComponent, AddRegionComponent ]
})
export class RegionModule { }
