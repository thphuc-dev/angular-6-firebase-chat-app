import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import * as layout from './layouts';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadChildren: './layouts/full-layout/full-layout.module#FullLayoutsModule'
  },
  layout.SimpleLayoutRouting,
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
