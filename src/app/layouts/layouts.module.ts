import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { SimpleLayoutComponent } from './simple-layout/simple-layout.component';
import { PipesModule } from '../pipes/pipes.module';

import { ToasterModule, ToasterService} from 'angular2-toaster/angular2-toaster';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PipesModule.forRoot(),
    ToasterModule
  ],
  declarations: [SimpleLayoutComponent]
})
export class LayoutsModule { }
