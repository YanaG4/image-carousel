import { Component, effect, input, signal } from '@angular/core';
import { Banner } from '../../model/banner.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.css'
})
export class ImageCarouselComponent {
  banners = input<Banner[]>([]);
  activeBannerIndex = signal<number>(0);
  constructor() {
    effect(() => {
      const intervalId = setInterval(() => {
        this.goNext();
      }, 2000);
      return () => clearInterval(intervalId);
    });
  }

  goNext() {
    if (this.banners().length - 1 === this.activeBannerIndex())
      this.activeBannerIndex.set(0)
    else 
      this.activeBannerIndex.update((i) => i + 1);
  }
  goPrev() {
    if (this.activeBannerIndex() === 0)
      this.activeBannerIndex.set(this.banners().length - 1)
    else 
      this.activeBannerIndex.update((i) => i - 1);
  }
}
