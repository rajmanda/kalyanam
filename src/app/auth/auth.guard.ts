import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private oauthService: OAuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Check if the user has a valid access token
    const hasValidAccessToken = this.oauthService.hasValidAccessToken();

    if (hasValidAccessToken) {
      return true; // Allow access to the route
    } else {
      // Redirect to the login page or another route
      //return this.router.createUrlTree(['/login']);
      return this.router.createUrlTree(['/login'], { queryParams: { message: 'You need to login to access this page' } });
    }
  }
}
