import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomFeeRoutingModule } from './room-fee-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { RoomFeeComponent } from './room-fee.component';
import { AddComponent } from './add/add.component';
import { PipesModule } from '../../../pipes/pipes.module';
@NgModule({
  imports: [
    CommonModule,
    RoomFeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    PipesModule.forRoot()
  ],
  declarations: [RoomFeeComponent, AddComponent]
})
export class RoomFeeModule { }
