import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoGalleryService {
  private baseUrl = 'http://132.145.206.61:5001';

  constructor(private http: HttpClient) {}

  getImages(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/images`);
  }

  deleteSelectedImages(images: string[]): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/delete`, JSON.stringify(images));
  }
}