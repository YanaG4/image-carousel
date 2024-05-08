import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ScreenSizeService } from './services/screen-size.service';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let screenSizeService: ScreenSizeService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [ScreenSizeService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    screenSizeService = TestBed.inject(ScreenSizeService);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
  describe('AppView', () => {
    it('should render text for desktop screen sizes', () => {
      spyOnProperty(app, 'isMobileView', 'get').and.returnValue(false);
      fixture.detectChanges();
      expect(document.body.textContent).toContain('600');
    });
    it('should render carousel for mobile screen sizes', () => {
      spyOnProperty(app, 'isMobileView', 'get').and.returnValue(true);
      fixture.detectChanges();
      expect(document.querySelector('.banners')).toBeTruthy();
    });
  })
});
