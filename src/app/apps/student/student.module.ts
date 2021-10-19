import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentRoutingModule } from './student-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { StudentComponent } from './student.component';
import { AddComponent } from './add/add.component';
import { SearchStudentComponent } from './search/search-student.component';
import { RegisterToStayComponent } from './register-to-stay/register-to-stay.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PipesModule } from '../../pipes/pipes.module';
import { ListAssessmentComponent } from './assessment/list-assessment/list-assessment.component';
import { DetailComponent } from './detail/detail.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@NgModule({
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    ModalModule.forRoot(),
    PipesModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot()
  ], 
  declarations: [StudentComponent, AddComponent, SearchStudentComponent, AssessmentComponent, RegisterToStayComponent, ListAssessmentComponent, DetailComponent]
})
export class StudentModule { }
