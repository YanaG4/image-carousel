import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerComponent } from './banner.component';
import { bannerData } from '../../store/bannerData';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a banner if banner object is provided', () => {
    component.banner = bannerData[0];
    fixture.detectChanges();
    expect(document.querySelector('.banner-overlay')).toBeTruthy();
  });

  it('should render text with span tags if provided', () => {
    component.banner = bannerData[0];
    fixture.detectChanges();
    const bannerOverlay = document.querySelector('.banner-overlay');
    const textSpan = bannerOverlay?.getElementsByTagName('span')
    expect(textSpan).toBeTruthy();
  });
});
