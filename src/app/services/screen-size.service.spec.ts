import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScreenSizeService } from './screen-size.service';

describe('ScreenSizeServiceService', () => {
  let service: ScreenSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('resizeListener', () => {
    beforeEach(() => {
      spyOn(window, 'setTimeout');
      spyOn(window, 'clearTimeout');
    });

    it('should create a timer on resize', () => {
      window.dispatchEvent(new Event('resize'));
      expect(window.setTimeout).toHaveBeenCalled();
    });

    it('should detect mobile device if width < 600px', fakeAsync(() => {
      spyOn(service, 'getInnerWidth').and.returnValue(599);
      window.dispatchEvent(new Event('resize'));
      tick(100);
      expect(service.isMobile()).toBe(true);
    }));

    it('should detect desktop device if width >= 600px', fakeAsync(() => {
      spyOn(service, 'getInnerWidth').and.returnValue(780);
      window.dispatchEvent(new Event('resize'));
      tick(100);
      expect(service.isMobile()).toBe(false);
    }));
  })
});
