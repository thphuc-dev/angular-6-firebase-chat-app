import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { MatDialogModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material';
import { DataTableModule } from './shared/data-table';
import { AppComponent } from './app.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AppRoutingModule } from './app.routing';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
import { SimpleNotificationsModule, PushNotificationsModule } from 'angular2-notifications';
import { ServicesModule } from './services';
import { SharedModule } from './shared/shared.module';
import { LayoutsModule } from './layouts/layouts.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { PipesModule } from './pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// AoT requires an exported function for factories
// export function HttpLoaderFactory(http: Http) {
//   return new TranslateHttpLoader(http);
// }

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [Http]
    //   }
    // }),
    BrowserAnimationsModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    // Ng2ModalModule.forRoot(),
    ChartsModule,
    SimpleNotificationsModule.forRoot(),
    PushNotificationsModule,
    ServicesModule,
    DataTableModule,
    BootstrapModalModule,
    ModalModule.forRoot(),
    MatDialogModule,
    MatTooltipModule,
    SharedModule,
    PipesModule.forRoot(),
    LayoutsModule,
    FormsModule,
    ColorPickerModule,
    LoadingBarHttpClientModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: PathLocationStrategy,
  }],
  bootstrap: [AppComponent],
  entryComponents: [
  ],
  exports: [
    // TranslateModule
  ]
})
export class AppModule { }
