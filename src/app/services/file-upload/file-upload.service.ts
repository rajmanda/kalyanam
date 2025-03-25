import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private fileUploadApiUrl = environment.apiBaseUrl + '/upload';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${this.fileUploadApiUrl}/picture-upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  listImages(): Observable<{images: string[]}> {
    return this.http.get<{images: string[]}>(`${this.fileUploadApiUrl}/list-images`);
  }
}
