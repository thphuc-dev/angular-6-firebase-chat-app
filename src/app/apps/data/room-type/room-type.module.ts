import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomTypeRoutingModule } from './room-type-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { RoomTypeComponent } from './room-type.component';
import { AddComponent } from './add/add.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
@NgModule({
  imports: [
    CommonModule,
    RoomTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    AngularMultiSelectModule
  ],
  declarations: [RoomTypeComponent, AddComponent]
})
export class RoomTypeModule { }
