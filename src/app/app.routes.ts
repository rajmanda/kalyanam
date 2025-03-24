import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GloginComponent } from './glogin/glogin.component';
import { AuthGuard } from './auth/auth.guard';
import { AboutMeComponent } from './about-me/about-me.component';
import { CreateGalaComponentComponent } from "./create-gala-component/create-gala-component.component";
import { CallbackComponent } from './callback/callback.component';
import { PictureGalleryComponent } from './picture-gallery/picture-gallery.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

export const routes: Routes = [

  { path: 'callback', component: CallbackComponent }, // Callback route for OAuth redirect
  { path: 'login', component: GloginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] }, // Protect /home
  { path: 'create-gala-event', component: CreateGalaComponentComponent},
  { path: 'about-me', component: AboutMeComponent },
  { path: 'pictures', component: PictureGalleryComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: FileUploadComponent},
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
]
