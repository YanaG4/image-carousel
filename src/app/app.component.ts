import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { Banner } from './model/banner.interface';
import { bannerData as data } from './store/bannerData';
import { ScreenSizeService } from './services/screen-size.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageCarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  bannerData = signal<Banner[]>([]);
  screenSizeService = inject(ScreenSizeService);
  isMobileView = this.screenSizeService.isMobile;

  ngOnInit(): void {
    this.bannerData.set(data);
  }
}
