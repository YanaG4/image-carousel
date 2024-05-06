import { Component, input } from '@angular/core';
import { Banner } from '../../model/banner.interface';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.css'
})
export class ImageCarouselComponent {
  banners = input<Banner[]>()
}
