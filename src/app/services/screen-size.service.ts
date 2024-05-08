import { Injectable, OnDestroy, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService implements OnDestroy {
  isMobile = signal(this.getIsMobileScreen());
  private resizeListener: () => void;
  private resizeTimeout?: number;

  constructor() {
    this.resizeListener = () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = window.setTimeout(() => {
        this.isMobile.set(this.getIsMobileScreen());
      }, 100);
    };
    window.addEventListener('resize', this.resizeListener);
  }

  private getIsMobileScreen(): boolean {
    const width = this.getInnerWidth();
    return width < 600;
  }

  getInnerWidth(): number {
    return window.innerWidth;
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
}
