import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GloginComponent } from './glogin/glogin.component';
import { AuthGuard } from './auth/auth.guard';
import { AboutMeComponent } from './about-me/about-me.component';
import { CreateGalaComponentComponent } from "./create-gala-component/create-gala-component.component";
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },                    // Redirect root to /login
  { path: 'callback', component: CallbackComponent }, // Callback route for OAuth redirect
  { path: 'login', component: GloginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protect /home
  { path: 'create-Gala-Event', component: CreateGalaComponentComponent},
  { path: 'about-me', component: AboutMeComponent }
]
