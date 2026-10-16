import { Routes } from '@angular/router';
import { Home } from './features/home/pages/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'حدوتاية | حكاية على قد وقتك',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
