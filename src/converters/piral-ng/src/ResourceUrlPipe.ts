import type { PiletApi } from 'piral-core';
import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'resourceUrl' })
export class ResourceUrlPipe implements PipeTransform {
  constructor(@Inject('piral') private piral: PiletApi) {}

  transform(value: string): string {
    const { basePath = '/' } = this.piral.meta;
    return basePath + value;
  }
}
