import { Injectable, OnDestroy, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService implements OnDestroy {
  isMobile = signal(this.getIsMobileScreen());
  private resizeListener: () => void;

  constructor() {
    this.resizeListener = () => {
      this.isMobile.set(this.getIsMobileScreen());
    };
    window.addEventListener('resize', this.resizeListener);
  }

  private getIsMobileScreen(): boolean {
    const width = window.innerWidth;
    return width < 600;
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
  }
}
