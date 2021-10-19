import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../shared/data-table';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from '../../pipes/pipes.module';
import { AgmCoreModule } from '@agm/core';
import { ToasterModule } from 'angular2-toaster/angular2-toaster';
import { DashboardService } from './dashboardService';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SelectModule } from 'ng2-select';
@NgModule({
  imports: [
    DashboardRoutingModule,
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
    SelectModule
  ],
  providers: [DashboardService],
  bootstrap: [DashboardComponent],
  declarations: [DashboardComponent]
})
export class DashboardModule {

}
