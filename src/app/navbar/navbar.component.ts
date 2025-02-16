import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CreateGalaComponentComponent } from "../create-gala-component/create-gala-component.component";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatToolbarModule, MatButtonModule, RouterLink, CommonModule, CreateGalaComponentComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  userProfilex: any;
  loggedin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userProfilex = this.authService.getUserProfile();

    if (this.userProfilex && Object.keys(this.userProfilex).length > 0) {
      // userProfilex is an object and has some properties
      console.log('userProfilex has properties:', this.userProfilex);
      this.loggedin = true ;
    } else {
      // userProfilex is empty, null, or undefined
      console.log('userProfilex is empty or undefined');
    }

  }

  handleSignOut() {
    this.authService.signOut();
    this.loggedin = false ;
  }
}
