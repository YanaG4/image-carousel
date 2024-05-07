import { AfterViewInit, Component, ElementRef, OnInit, computed, effect, inject, input, signal } from '@angular/core';
import { Banner } from '../../model/banner.interface';
import { CommonModule } from '@angular/common';
import { fromEvent, interval, last, map, switchMap, takeLast, takeUntil, throttle } from 'rxjs';
import { BannerComponent } from '../banner/banner.component';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.css'
})
export class ImageCarouselComponent implements AfterViewInit, OnInit {
  banners = input<Banner[]>([]);
  infiniteBanners: Banner[] = [];

  activeBannerIndex = signal<number>(1);
  initialX = signal<number>(0);
  x = signal<number>(0);
  finalX = signal<number>(0);
  transition = true;
  diff = computed<number>(() => this.initialX() - this.x());
  private threshold = 80;
  private ref = inject(ElementRef);
  
  constructor() {
    effect(() => {
      const intervalId = setInterval(() => {
        if(this.x() === 0) this.goNext();
      }, 10000);
      return () => clearInterval(intervalId);
    });
  }
  
  ngOnInit(): void {
    if (this.banners().length > 0) {
      this.infiniteBanners = [
        this.banners()[this.banners().length - 1],
        ...this.banners(),
        this.banners()[0]
      ];
    }
  }
  ngAfterViewInit() {
    const carouselElement = this.ref.nativeElement;
    const touchStart$ = fromEvent<TouchEvent>(carouselElement, 'touchstart');
    const touchMove$ = fromEvent<TouchEvent>(carouselElement, 'touchmove');
    const touchEnd$ = fromEvent<TouchEvent>(carouselElement, 'touchend');
    const swipe$ = touchStart$.pipe(
      map(t => {
      this.transition = false;
      this.initialX.set(t.touches[0].clientX); 
      this.x.set(t.touches[0].clientX);
      return t;
    }), 
      switchMap(_ => touchMove$.pipe(
        map(m => {this.x.set(m.touches[0].clientX); return m;}),
        takeUntil(touchEnd$),
        last(undefined, { touches: [{ clientX: this.initialX() }] }),
        map(m => {this.finalX.set(m.touches[0].clientX); this.transition = true;})
    ))
  );
    swipe$.subscribe({
      next: () => {
        const diff = this.initialX() - this.finalX();
        console.log(diff);
        if(Math.abs(diff) >= this.threshold) {
          diff > 0 ? this.goNext() : this.goPrev();
          this.transition = true;
        } else
        this.clearCoordinates();
      },
    })
  }

  goNext() {
    this.activeBannerIndex.update((i) => i + 1);
    this.transition = true;
    if (this.activeBannerIndex() === this.infiniteBanners.length - 1) {
      setTimeout(() => {
        this.transition = false;
        this.activeBannerIndex.set(1);
      }, 300);
    }
    this.clearCoordinates();
  }
  goPrev() {
    this.activeBannerIndex.update((i) => i - 1);
    this.transition = true;
    if (this.activeBannerIndex() === 0) {
      setTimeout(() => {
        this.transition = false;
        this.activeBannerIndex.set(this.infiniteBanners.length - 2);
      }, 300);
    }
    this.clearCoordinates();
  }

  clearCoordinates() { 
    this.initialX.set(0);
    this.finalX.set(0);
    this.x.set(0);
  }
}
