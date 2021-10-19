import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChatComponent } from './chat.component';
import { ChatRoutingModule } from './chat-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { LaddaModule } from 'angular2-ladda';
import { AgmCoreModule } from '@agm/core';
import { ToasterModule} from 'angular2-toaster/angular2-toaster';
import { ChatService } from './chatService';
import { environment } from '../../../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PipesModule } from '../../pipes/pipes.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@NgModule({
  imports: [
    ChatRoutingModule,
    ChartsModule,
    CommonModule,
    SimpleNotificationsModule,
    PushNotificationsModule,
    LaddaModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    ToasterModule,
    AngularFireModule.initializeApp(environment.innoway.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    PipesModule.forRoot(),
    BsDropdownModule.forRoot(),
    InfiniteScrollModule
  ],
  providers: [ChatService],
  bootstrap: [ChatComponent],
  declarations: [ChatComponent]
})
export class ChatModule {

}
