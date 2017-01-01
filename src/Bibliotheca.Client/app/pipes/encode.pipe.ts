import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'encodeFilter' })
export class EncodeFilterPipe implements PipeTransform {

    transform(value: string): string {
        return value.replace("/", "%2F");
    }

}