import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  public transform(url) {
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      return this.sanitizer.bypassSecurityTrustResourceUrl('404');
    }
  }
} 