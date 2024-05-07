import { Component, Input, OnInit, inject, input } from '@angular/core';
import { Banner } from '../../model/banner.interface';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit {
  @Input() banner!: Banner;
  text: SafeHtml = '';
  title: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.text = this.sanitize(this.banner?.text);
    this.title = this.sanitize(this.banner?.title);
  }

  private sanitize(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}
