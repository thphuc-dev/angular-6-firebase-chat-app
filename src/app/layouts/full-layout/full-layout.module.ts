import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared';
import { FullLayoutComponent } from './full-layout.component';
import { PipesModule } from '../../pipes/pipes.module';
import { FullLayoutRouting } from '../full-layout/routing';
import { ToasterModule } from 'angular2-toaster';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from '../../../../node_modules/angular2-ladda';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
export const routes: Routes = [
  FullLayoutRouting
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PipesModule.forRoot(),
    ToasterModule.forRoot(),
    RouterModule.forChild(routes),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    LaddaModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [ FullLayoutComponent],
  exports: [RouterModule]
})
export class FullLayoutsModule { }
