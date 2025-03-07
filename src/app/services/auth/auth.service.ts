import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { authConfig } from './auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  constructor(private oauthService: OAuthService, private router: Router) {
    this.configureOAuth();
  }

  private configureOAuth(): void {
    this.oauthService.configure(authConfig);

    // Load discovery document and try to log in
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      console.log('Discovery document loaded and login attempted');
      if (this.isLoggedIn()) {
        console.log('User is logged in');
        this.publishUserInfo(); // Publish user info if already logged in
        this.router.navigate(['/home']); // Redirect to home page after successful login
      } else {
        console.log('User is not logged in');
      }
    }).catch((err) => {
      console.error('Error loading discovery document or trying login:', err);
    });

    // Listen to OAuth events to handle token expiration, refresh, or logout
    this.oauthService.events.subscribe((event) => {
      console.log('OAuth Event:', event); // Debug log for OAuth events

      if (event.type === 'token_received' || event.type === 'token_refreshed') {
        console.log('Token received or refreshed');
        this.publishUserInfo();
        this.router.navigate(['/home']); // Redirect to home page after token received or refreshed
      } else if (event.type === 'logout') {
        console.log('User logged out');
        this.userProfileSubject.next(null); // Clear user profile on logout
        this.router.navigate(['/login']); // Redirect to login page
      } else if (event.type === 'token_expires') {
        console.warn('Access token is about to expire');
        this.refreshToken(); // Refresh token before it expires
      }
    });
  }

  login(): void {
    console.log('Google Login Triggered'); // Debug Log
    this.oauthService.initLoginFlow(undefined, { ux: 'popup' }); // Use popup for login
  }

  isLoggedIn(): boolean {
    const isLoggedIn = this.oauthService.hasValidAccessToken();
    console.log('Is user logged in?', isLoggedIn); // Debug log
    return isLoggedIn;
  }

  logout(): void {
    this.oauthService.logOut(); // Log out and clear tokens
    this.userProfileSubject.next(null); // Clear user profile
    this.router.navigate(['/login']); // Redirect to login page
  }

  private publishUserInfo(): void {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      console.log('User Claims', claims); // Debug log
      this.userProfileSubject.next(claims); // Emit new user profile
    }
  }

  getAccessToken(): string {
    const token = this.oauthService.getAccessToken();
    console.log('Access Token:', token); // Debug log
    return token;
  }

  refreshToken(): void {
    this.oauthService.refreshToken().then(() => {
      console.log('Token refreshed'); // Debug log
      this.publishUserInfo();
    }).catch((err) => {
      console.error('Failed to refresh token:', err); // Debug log
    });
  }
}
