import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc'; // Import OAuthService
import { AdminsDTO } from '../../models/admins';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  private adminsApiUrl = '';
  data: AdminsDTO[] = [];

  constructor(private http: HttpClient, private oauthService: OAuthService) {
    this.adminsApiUrl = environment.adminsApiUrl;
    console.log(environment.adminsApiUrl);
  }

  getAdmins(): Observable<AdminsDTO[]> {
    const token = this.oauthService.getAccessToken(); // Now properly injected
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<AdminsDTO[]>(`${this.adminsApiUrl}/alladmins`, {
      headers,
    });
  }

  isAdmin(email: string): Observable<boolean> {
    return this.getAdmins().pipe(
      map((admins) => {
        return admins.some((admin) => admin.email === email);
      })
    );
  }
}
