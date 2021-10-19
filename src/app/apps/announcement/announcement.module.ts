import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAnnouncementRoutingModule } from './announcement-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { PipesModule } from '../../pipes/pipes.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from './../../../environments/environment';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AddAnnouncementComponent } from './announcement.component';
@NgModule({
  imports: [
    CommonModule,
    AddAnnouncementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    DataTableModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAC_NI2xITI6n6hky-5CAiemtWYCsrO28',
      libraries: ['places,drawing']
    }),
    PipesModule.forRoot(),
    AngularFireModule.initializeApp(environment.innoway.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot()
  ],
  declarations: [AddAnnouncementComponent]
})
export class AddAnnouncementModule { }
