import { Component, OnInit  } from '@angular/core';
import { PhotoGalleryService } from './../photo-gallery.service';
import { HttpErrorResponse  } from '@angular/common/http';

interface Image {
  name: string;
}

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent implements OnInit {
  images: string[] = [];
  selectedImages: Set<string> = new Set();
  baseUrl = 'http://132.145.206.61:5002/';

  constructor(private photoGalleryService: PhotoGalleryService) {}

  ngOnInit(): void {
    this.loadImages();
  }
  
  toggleSelection(imageName: string) {
    if (this.selectedImages.has(imageName)) {
      this.selectedImages.delete(imageName);
    } else {
      this.selectedImages.add(imageName);
    }
  }

  loadImages(): void {
    this.photoGalleryService.getImages()
      .subscribe(images => {
        this.images = images;
      },
      error => {
        console.error("Error fetching images:", error);
        alert("An error occurred while fetching images.");
      });
  }

  getImageUrl(imageName: string): string {
    return `${this.baseUrl}/uploads/${imageName}`;
  }

  deleteSelectedImages(): void {
    const selectedImagesArray = Array.from(this.selectedImages);
    this.photoGalleryService.deleteSelectedImages(selectedImagesArray)
      .subscribe(
        (response: any) => {
          if (response && response.message === "Images deleted successfully") {
            this.selectedImages.clear();
            this.loadImages();
            alert("Images deleted successfully!");
          } else {
            console.error("An error occurred while deleting the images.", response);
            alert("An error occurred while deleting the images.");
          }
        },
        (error: HttpErrorResponse) => {
          console.error("An error occurred while deleting the images.", error);
          alert("An error occurred while deleting the images.");
        }
      );
  }

  formattedTimestamp(imageName: string): string {
    const timestampPart = imageName.split("_")[0];
    const formattedTimestamp = timestampPart
      .replace("Z", "")
      .replace("-", "/")
      .replace("-", "/")
      .replace("-", ":")
      .replace("-", ":")
      .replace("T", " - ")
      .slice(0, -4);
  
    return formattedTimestamp;
  }
  
}
