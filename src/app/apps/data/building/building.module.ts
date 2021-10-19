import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingRoutingModule } from './building-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { BuildingComponent } from './building.component';
import { AddComponent } from './add/add.component';
import { RoomComponent } from './room/room.component';
import { AddRoomComponent } from './room/add-room/add-room.component';
@NgModule({
  imports: [
    CommonModule,
    BuildingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
  ],
  declarations: [BuildingComponent, AddComponent , RoomComponent, AddRoomComponent]
})
export class BuildingModule { }
