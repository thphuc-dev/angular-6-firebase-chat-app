import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffRoutingModule } from './staff-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { StaffComponent } from './staff.component';
import { AddComponent } from './add/add.component';
import { ProfileComponent } from './profile/profile.component';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { DetailComponent } from './detail/detail.component';
@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    TabsModule.forRoot()
  ],
  declarations: [StaffComponent, AddComponent, ProfileComponent, DetailComponent]
})
export class StaffModule { }
