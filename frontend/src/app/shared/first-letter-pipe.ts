import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    return (value ?? '').trim().charAt(0).toUpperCase();
  }

}
