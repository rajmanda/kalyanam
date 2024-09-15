import { Routes } from '@angular/router';
import { GloginComponent } from './glogin/glogin.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'login', component: GloginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: GloginComponent },

]
