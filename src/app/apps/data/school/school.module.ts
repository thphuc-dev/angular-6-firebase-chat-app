import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolRoutingModule } from './school-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { SchoolComponent } from './school.component';
import { AddComponent } from './add/add.component';
import { MajorComponent } from './major/major.component';
import { AddMajorComponent } from './major/add-major/add-major.component';
import { ClassComponent } from './class/class.component';
import { AddClassComponent } from './class/add-class/add-class.component';
@NgModule({
  imports: [
    CommonModule,
    SchoolRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
  ],
  declarations: [SchoolComponent, AddComponent, MajorComponent, AddMajorComponent, ClassComponent, AddClassComponent,]
})
export class SchoolModule { }
