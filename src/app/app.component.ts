import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { Banner } from './model/banner.interface';
import { bannerData } from './store/bannerData';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ImageCarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  bannerData = signal<Banner[]>([]);
  ngOnInit(): void {
      this.bannerData.set(bannerData);
  }
}
