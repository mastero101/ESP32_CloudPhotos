import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoGalleryService {
  private baseUrl = 'http://132.145.206.61:5001';

  constructor() {}

  async getImages(): Promise<string[]> { // Use async/await with Axios
    const response = await axios.get<string[]>(`${this.baseUrl}/images`);
    return response.data;
  }

  async deleteImages(images: string[]): Promise<string> { // Use async/await with Axios
    const response = await axios.post<string>(`${this.baseUrl}/delete`, images);
    return response.data;
  }
}
