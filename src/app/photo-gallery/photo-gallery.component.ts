import { Component, OnInit  } from '@angular/core';
import { PhotoGalleryService } from './../photo-gallery.service';
import { HttpErrorResponse  } from '@angular/common/http';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
  selectedImageCount: number = 12;
  imageCountOptions: number[] = [12, 24, 36, 48, 96];
  baseUrl = 'http://132.145.206.61:5002/';

  selectedDate: Date = new Date();
  filteredImages: string[] = [];

  constructor(private photoGalleryService: PhotoGalleryService) {}

  ngOnInit(): void {
    this.loadImages();
    this.onDateChange();
  }
  
  toggleSelection(imageName: string): void {
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
        this.applyDateFilter(); // Aplica el filtro por fecha después de cargar las imágenes
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
    if (confirm("Are you sure you want to delete the selected images?")) {
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
  }
  
  selectImages(): void {
    const selectedImages = this.filteredImages.slice(0, this.selectedImageCount);
    selectedImages.forEach(image => this.toggleSelection(image));
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

  formattedDateOnly(imageName: string): string {
    const timestampPart = imageName.split("_")[0];
    const formattedDate = timestampPart.replace(/\-/g, '/').slice(0, 10); // Formato YYYY/MM/DD
    return formattedDate;
  }

  onDateChange(event?: MatDatepickerInputEvent<Date>): void {
    if (event && event.value) {
      this.selectedDate = event.value;
    } else {
      this.selectedDate = new Date(); // Establecer la fecha actual si no se selecciona ninguna
    }
  
    const selectedDateStr = this.formattedDateOnly(this.selectedDate.toISOString());
  
    this.filteredImages = this.images.filter(image => {
      const imageDate = this.formattedDateOnly(image); // Obtén la parte de la fecha de la imagen
      return imageDate === selectedDateStr;
    });
    this.applyDateFilter();
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    console.log('Comparing Dates:', date1, date2);
    
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  applyDateFilter(): void {
    const selectedDateStr = this.formattedDateOnly(this.selectedDate.toISOString());
  
    this.filteredImages = this.images.filter(image => {
      const imageDate = this.formattedDateOnly(image); // Obtén la parte de la fecha de la imagen
      return imageDate === selectedDateStr;
    });
  }

  reverseImageOrder(): void {
    this.filteredImages.reverse();
  }
  
}
