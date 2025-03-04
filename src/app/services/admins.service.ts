import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminsDTO } from '../models/admins';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

    private adminsApiUrl = '';
    data: AdminsDTO[]  = [];

    constructor(private http: HttpClient, private oauthService: OAuthService) {
      this.adminsApiUrl  = environment.adminsApiUrl;
      console.log(environment.adminsApiUrl);
    }

    getAdmins(): Observable<AdminsDTO[]> {
      // Get the access token from the OAuthService
      const token = this.oauthService.getAccessToken();

      // Set the Authorization header with the Bearer token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<AdminsDTO[]>(`${this.adminsApiUrl}/alladmins`, { headers });
    }

    isAdmin(email: string): Observable<boolean> {
      return this.getAdmins().pipe(
        map(admins => {
          // Check if any admin has the matching email
          const isAdmin = admins.some(admin => {
            return admin.email === email;
          });
          return isAdmin; // Return true or false
        })
      );
    }
}
