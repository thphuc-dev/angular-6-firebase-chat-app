import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomManagerComponent } from './room-manager.component';
import { RoomManagerRoutingModule } from './room-manager-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../shared/data-table';
import { PipesModule } from '../../pipes/pipes.module';
import { AgmCoreModule } from '@agm/core';
import { ReservationComponent } from './reservation/reservation.component';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    RoomManagerRoutingModule,
    CommonModule,
    SimpleNotificationsModule,
    PushNotificationsModule,
    LaddaModule,
    DataTableModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    ModalModule.forRoot()
  ],
  bootstrap: [RoomManagerComponent],
  declarations: [RoomManagerComponent, ReservationComponent]
})
export class RoomManagerModule {

}
