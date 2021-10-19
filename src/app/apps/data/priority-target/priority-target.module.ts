import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityTargetRoutingModule } from './priority-target-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { PriorityTargetComponent } from './priority-target.component';
import { AddComponent } from './add/add.component';
@NgModule({
  imports: [
    CommonModule,
    PriorityTargetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
  ],
  declarations: [PriorityTargetComponent, AddComponent]
})
export class PriorityTargetModule { }
