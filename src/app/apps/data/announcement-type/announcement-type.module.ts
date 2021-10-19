import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementTypeRoutingModule } from './announcement-type-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { DataTableModule } from '../../../shared/data-table';
import { AgmCoreModule } from '@agm/core';
import { AnnouncementTypeComponent } from './announcement-type.component';
import { AddComponent } from './add/add.component';
import { PipesModule } from '../../../pipes/pipes.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../../../../environments/environment';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AddAnnouncementComponent } from './announcement/add/add.component';
@NgModule({
  imports: [
    CommonModule,
    AnnouncementTypeRoutingModule,
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
  declarations: [AnnouncementTypeComponent, AddComponent , AnnouncementComponent, AddAnnouncementComponent]
})
export class AnnouncementTypeModule { }
