import { AfterViewInit, Component, ElementRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Banner } from '../../model/banner.interface';
import { CommonModule } from '@angular/common';
import { fromEvent, last, map, switchMap, takeUntil } from 'rxjs';
import { BannerComponent } from '../banner/banner.component';
import { bannerData as data } from '../../store/bannerData';

interface xCoordinates {
  initialX: number;
  x: number;
  finalX: number;
}

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.css'
})
export class ImageCarouselComponent implements AfterViewInit, OnInit {
  banners = signal<Banner[]>([]);
  infiniteBanners: Banner[] = [];

  activeBannerIndex = signal<number>(1);
  xCoordinates = signal<xCoordinates>({
    initialX: 0,
    x: 0,
    finalX: 0,
  });
  transition = signal<boolean>(true);
  diff = computed<number>(() => this.xCoordinates().initialX - this.xCoordinates().x);
  private threshold = 80;
  private ref = inject(ElementRef);
  
  constructor() {
    effect(() => {
      if(this.banners().length <= 1) return;
      const intervalId = setInterval(() => {
        if(this.xCoordinates().x === 0) this.goNext();
      }, 10000);
      return () => clearInterval(intervalId);
    });
  }
  
  ngOnInit(): void {
    this.banners.set(data);

    if (this.banners().length > 1) {
      this.infiniteBanners = [
        this.banners()[this.banners().length - 1],
        ...this.banners(),
        this.banners()[0]
      ];
    } else if (this.banners().length === 1) {
      this.infiniteBanners = [ ...this.banners() ];
      this.activeBannerIndex.set(0);
    }
  }
  ngAfterViewInit() {
    if(this.banners().length <= 1) return;
    const carouselElement = this.ref.nativeElement;
    const touchStart$ = fromEvent<TouchEvent>(carouselElement, 'touchstart');
    const touchMove$ = fromEvent<TouchEvent>(carouselElement, 'touchmove');
    const touchEnd$ = fromEvent<TouchEvent>(carouselElement, 'touchend');
    const swipe$ = touchStart$.pipe(
      map(t => {
      this.transition.set(false);
      const x = t.touches[0].clientX;
      this.xCoordinates.update(prev => ({...prev, initialX: x, x}));
      return t;
    }), 
      switchMap(_ => touchMove$.pipe(
        map(m => {
          const x = m.touches[0].clientX;
          this.xCoordinates.update(prev => ({...prev, x}));
          return m; 
        }),
        takeUntil(touchEnd$),
        last(undefined, { touches: [{ clientX: this.xCoordinates().initialX }] }),
        map(m => {
          const x = m.touches[0].clientX;
          this.xCoordinates.update(prev => ({...prev, finalX: x}));
          this.transition.set(true);
        })
    ))
  );
    swipe$.subscribe({
      next: () => {
        const diff = this.xCoordinates().initialX - this.xCoordinates().finalX;
        console.log(diff);
        if(Math.abs(diff) >= this.threshold) {
          diff > 0 ? this.goNext() : this.goPrev();
          this.transition.set(true);
        } else
        this.clearCoordinates();
      },
    })
  }

  goNext() {
    this.activeBannerIndex.update((i) => i + 1);
    this.transition.set(true);
    if (this.activeBannerIndex() === this.infiniteBanners.length - 1) {
      setTimeout(() => {
        this.transition.set(false);
        this.activeBannerIndex.set(1);
      }, 300);
    }
    this.clearCoordinates();
  }
  goPrev() {
    this.activeBannerIndex.update((i) => i - 1);
    this.transition.set(true);
    if (this.activeBannerIndex() === 0) {
      setTimeout(() => {
        this.transition.set(false);
        this.activeBannerIndex.set(this.infiniteBanners.length - 2);
      }, 300);
    }
    this.clearCoordinates();
  }

  clearCoordinates() { 
    this.xCoordinates.set({ initialX: 0, finalX: 0, x: 0 });
  }
}
