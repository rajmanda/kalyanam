import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

declare const google: any;  // Needed for Google authentication methods

@Component({
  selector: 'app-glogin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './glogin.component.html',
  styleUrl: './glogin.component.css'
})
export class GloginComponent {
  loginMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the query parameter message
    this.route.queryParams.subscribe(params => {
      this.loginMessage = params['message'];
    });
  }

  loginWithGoogle(): void {
    this.authService.login();
  }
}
