import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private fileUploadApiUrl = 'http://localhost:8080/upload';

  constructor(private http: HttpClient) {
     this.fileUploadApiUrl  = environment.fileUploadApiUrl;
    console.log(this.fileUploadApiUrl );
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    console.log('file', file, file.name );
    formData.append('file', file, file.name);
    return this.http.post(`${this.fileUploadApiUrl}/picture-upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
