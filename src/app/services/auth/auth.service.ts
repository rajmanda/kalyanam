import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { authConfig } from './auth-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userProfileSubject = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject.asObservable();
  private adminsApiUrl = environment.adminsApiUrl;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.configureOAuth();
  }

  private configureOAuth(): void {
    this.oauthService.configure(authConfig);

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      console.log('Discovery document loaded and login attempted');
      if (this.isLoggedIn()) {
        console.log('User is logged in');
        this.publishUserInfo();
        this.router.navigate(['/home']);
      } else {
        console.log('User is not logged in');
      }
    }).catch((err) => {
      console.error('Error loading discovery document or trying login:', err);
    });

    this.oauthService.events.subscribe((event) => {
      console.log('OAuth Event:', event);

      if (event.type === 'token_received' || event.type === 'token_refreshed') {
        console.log('Token received or refreshed');
        this.publishUserInfo();
        this.router.navigate(['/home']);
      } else if (event.type === 'logout') {
        console.log('User logged out');
        this.userProfileSubject.next(null);
        this.router.navigate(['/login']);
      } else if (event.type === 'token_expires') {
        console.warn('Access token is about to expire');
        this.refreshToken();
      }
    });
  }

  login(): void {
    console.log('Google Login Triggered');
    this.oauthService.initLoginFlow(undefined, { ux: 'popup' });
  }

  isLoggedIn(): boolean {
    const isLoggedIn = this.oauthService.hasValidAccessToken();
    console.log('Is user logged in?', isLoggedIn);
    return isLoggedIn;
  }

  logout(): void {
    this.oauthService.logOut();
    this.userProfileSubject.next(null);
    this.router.navigate(['/login']);
  }

  private publishUserInfo(): void {
    const claims = this.oauthService.getIdentityClaims();
    if (claims) {
      console.log('User Claims', claims);
      this.userProfileSubject.next(claims);
    }
  }

  getAccessToken(): string {
    const token = this.oauthService.getAccessToken();
    console.log('Access Token:', token);
    return token;
  }

  refreshToken(): void {
    this.oauthService.refreshToken().then(() => {
      console.log('Token refreshed');
      this.publishUserInfo();
    }).catch((err) => {
      console.error('Failed to refresh token:', err);
    });
  }

  // Synchronous method to get user email
  getUserEmail(): string {
    const claims = this.oauthService.getIdentityClaims();
    if (claims && 'email' in claims) {
      return claims['email'];
    }
    return "abc@xyz.com";
  }

  // Synchronous method to get user name
  getUserName(): string {
    const claims = this.oauthService.getIdentityClaims();

    if (claims) {
      if ('name' in claims) {
        return claims['name'];
      }
      else if ('given_name' in claims && 'family_name' in claims) {
        return `${claims['given_name']} ${claims['family_name']}`;
      }
      else if ('preferred_username' in claims) {
        return claims['preferred_username'];
      }
    }

    return "Anonymous User";
  }

  // Observable method to get user name (reacts to changes)
  getUserName$(): Observable<string> {
    return this.userProfile$.pipe(
      map(claims => {
        if (!claims) return "Anonymous User";
        if ('name' in claims) return claims['name'];
        if ('given_name' in claims && 'family_name' in claims) {
          return `${claims['given_name']} ${claims['family_name']}`;
        }
        if ('preferred_username' in claims) return claims['preferred_username'];
        return "Anonymous User";
      })
    );
  }

  // Check if user is admin
  isAdmin(email: string): Observable<boolean> {
    const token = this.getAccessToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ email: string }[]>(`${this.adminsApiUrl}/alladmins`, { headers }).pipe(
      map(admins => {
        const isAdmin = admins.some(admin => admin.email === email);
        return isAdmin;
      })
    );
  }
}
