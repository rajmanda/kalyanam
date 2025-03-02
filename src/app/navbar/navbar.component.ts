import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CreateGalaComponentComponent } from "../create-gala-component/create-gala-component.component";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatToolbarModule, MatButtonModule, RouterLink, CommonModule, CreateGalaComponentComponent, MatSidenavModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userProfilex: any;
  loggedin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to userProfile$ observable to react immediately to login events
    this.authService.userProfile$.subscribe(profile => {
      if (profile && Object.keys(profile).length > 0) {
        console.log('User Logged In:', profile);
        this.userProfilex = profile;
        this.loggedin = true;
      } else {
        console.log('No user logged in');
        this.userProfilex = null;
        this.loggedin = false;
      }
    });
  }

  handleSignOut() {
    this.authService.logout();
    this.loggedin = false ;
  }
}
