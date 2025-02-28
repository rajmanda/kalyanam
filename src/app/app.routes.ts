import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GloginComponent } from './glogin/glogin.component';
import { CanActivateFn } from './auth/auth.guard';
import { AboutMeComponent } from './about-me/about-me.component';
import { CreateGalaComponentComponent } from "./create-gala-component/create-gala-component.component";

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },                    // Redirect root to /login
  { path: 'login', component: GloginComponent },
  { path: 'home', component: HomeComponent, canActivate: [CanActivateFn] }, // Applying the guard function here
  { path: 'create-Gala-Event', component: CreateGalaComponentComponent},
  { path: 'about-me', component: AboutMeComponent },
  // other routes...
  { path: '', component: GloginComponent },

]
