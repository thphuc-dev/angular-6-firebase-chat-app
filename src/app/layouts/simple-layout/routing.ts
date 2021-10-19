import { SimpleLayoutComponent } from './simple-layout.component';
export const SimpleLayoutRouting = {
  path: '',
  component: SimpleLayoutComponent,
  loadChildren: './pages/pages.module#PagesModule'
};
