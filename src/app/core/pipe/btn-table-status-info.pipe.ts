import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'btnTableStatusInfo',
  pure: true
})
export class BtnTableStatusInfoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
