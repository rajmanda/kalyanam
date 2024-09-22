import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GloginComponent } from './glogin/glogin.component';
import { CanActivateFn } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: GloginComponent },
  { path: 'home', component: HomeComponent, canActivate: [CanActivateFn] }, // Applying the guard function here
  // other routes...
  { path: '', component: GloginComponent },

]
