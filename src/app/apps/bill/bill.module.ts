import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BillComponent } from './bill.component';
import { BillRoutingModule } from './bill-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../shared/data-table';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from '../../pipes/pipes.module';
import { AgmCoreModule } from '@agm/core';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SelectModule } from 'ng2-select';
import { PersonalComponent } from './personal/personal.component';
import { AddPersonalBillComponent } from './personal/add/add.component';
import { SharedComponent } from './shared/shared.component';
import { AddSharedBillComponent } from './shared/add/add.component';
import { EditPersonalBillComponent } from './personal/edit/edit.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { EditSharedBillComponent } from './shared/edit/edit.component';
@NgModule({
  imports: [
    BillRoutingModule,
    ChartsModule,
    CommonModule,
    SimpleNotificationsModule,
    PushNotificationsModule,
    LaddaModule,
    DataTableModule,
    TextMaskModule,
    BsDropdownModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    ToasterModule,
    SelectModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  bootstrap: [BillComponent],
  declarations: [BillComponent, PersonalComponent, AddPersonalBillComponent, SharedComponent, AddSharedBillComponent, EditPersonalBillComponent, EditSharedBillComponent]
})
export class BillModule {

}
