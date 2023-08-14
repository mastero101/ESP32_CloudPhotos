import { Component, OnInit  } from '@angular/core';
import { PhotoGalleryService } from './../photo-gallery.service';


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

  constructor(private photoGalleryService: PhotoGalleryService) {}

  ngOnInit(): void {
    this.fetchImages();
  }
  
  toggleSelection(imageName: string) {
    if (this.selectedImages.has(imageName)) {
      this.selectedImages.delete(imageName);
    } else {
      this.selectedImages.add(imageName);
    }
  }

  fetchImages(): void {
    this.photoGalleryService.getImages()
    .then(images => {
      this.images = images;
    })
    .catch(error => {
      console.error('Error fetching images:', error);
    });
  }

  async deleteSelectedImages(): Promise<void> {
    if (this.selectedImages.size === 0) {
      alert('Please select at least one image to delete.');
      return;
    }
  
    const shouldDelete = confirm('Are you sure you want to delete the selected images?');
    if (!shouldDelete) {
      return;
    }
  
    const imagesToDelete = Array.from(this.selectedImages);
  
    try {
      const response = await this.photoGalleryService.deleteImages(imagesToDelete);
      if (response.includes('File deleted successfully')) {
        this.selectedImages.clear();
        await this.fetchImages();
      } else {
        alert('An error occurred while deleting the images.');
      }
    } catch (error) {
      console.error('Error deleting images:', error);
      alert('An error occurred while deleting the images.');
    }
  }

  formattedTimestamp(imageName: string) {
    // Implement logic to format timestamp from image name
  }
}
