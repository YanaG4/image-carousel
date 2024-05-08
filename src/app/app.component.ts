import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { ScreenSizeService } from './services/screen-size.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageCarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  screenSizeService = inject(ScreenSizeService);
  get isMobileView() {
    return this.screenSizeService.isMobile();
  }
  constructor() {}  
}
