import { Routes } from '@angular/router';
import { GloginComponent } from './glogin/glogin.component';

export const routes: Routes = [
  { path: 'login', component: GloginComponent },
  { path: '', component: GloginComponent },

]
