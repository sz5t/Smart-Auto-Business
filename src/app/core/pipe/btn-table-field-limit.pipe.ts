import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringLimit',
  pure: true
})
export class BtnTableFieldLimit implements PipeTransform {

  public transform(value: string, args?: number): any {
    if (value && value.length > args) {
      return `${value.substring(0, args - 1)} ...`;
    }  else if (value && value.length < args) {
      return value;
    } else {
      return null;
    }
  }
}
