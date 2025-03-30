import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar-new',
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    CommonModule,
    MatSidenavModule,
    MatMenuModule
  ],
  templateUrl: './navbar-new.component.html',
  styleUrl: './navbar-new.component.css'
})
export class NavbarNewComponent {

    userProfilex: any;
    loggedin: boolean = false;
    mobileMenuOpen: boolean = false;
    isMobile: boolean = false;

    constructor(
      private authService: AuthService,
      private breakpointObserver: BreakpointObserver
    ) {
        this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
        this.isMobile = result.matches;
      });
    }

  ngOnInit(): void {
    // Existing auth subscription
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
  // Existing sign out method
  handleSignOut() {
    this.authService.logout();
    this.loggedin = false;
  }
}
