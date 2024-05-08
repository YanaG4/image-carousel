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
  infiniteBanners: Banner[] = []; // infinite banners are achieved via the duplication of the 1st and last banners

  activeBannerIndex = signal<number>(1);
  xCoordinates = signal<xCoordinates>({
    initialX: 0,
    x: 0,
    finalX: 0,
  });
  transition = signal<boolean>(true); // turns on/off transition animation (for performance optimization)
  diff = computed<number>(() => this.xCoordinates().initialX - this.xCoordinates().x); //serves drag and drop effect
  private threshold = 80; // after passing the threshold the banner changes
  private ref = inject(ElementRef);
  
  constructor() {
    effect(() => {
      // if we got <= 1 banner - don't swipe the banners on timer
      if(this.banners().length <= 1) return;
      const intervalId = setInterval(() => {
        if(this.xCoordinates().x === 0) this.goNext();
      }, 10000);
      return () => clearInterval(intervalId);
    });
  }
  
  ngOnInit(): void {
    this.banners.set(data);

    // copy banners and add 1st and last banner duplicates
    if (this.banners().length > 1) {
      this.infiniteBanners = [
        this.banners()[this.banners().length - 1],
        ...this.banners(),
        this.banners()[0]
      ];
    } else if (this.banners().length === 1) { // don't duplicate banners if there's just 1 banner (as there's nothing to swipe between)
      this.infiniteBanners = [ ...this.banners() ];
      this.activeBannerIndex.set(0);
    }
  }
  ngAfterViewInit() {
    if(this.banners().length <= 1) return; // no swipeable functionality (as there's nothing to swipe between)
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
      last(undefined, { touches: [{ clientX: this.xCoordinates().initialX }] }), // if touch with no movement - assign last value to initial value
      map(m => {
        const x = m.touches[0].clientX;
        this.xCoordinates.update(prev => ({...prev, finalX: x}));
        this.transition.set(true);
      })
    )));
    swipe$.subscribe({
      next: () => {
        const diff = this.xCoordinates().initialX - this.xCoordinates().finalX;
        console.log(diff);
        if(Math.abs(diff) >= this.threshold) { // if swipe move passes the threshold
          diff > 0 ? this.goNext() : this.goPrev(); // get the swipe direction and change the banner
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
      // if it is the last banner (duplicate of the first one), after the transition effect ends replace the duplicate with the real one
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
