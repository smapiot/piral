import type { PiletApi } from 'piral-core';
import { Component, ElementRef, Input, Inject, OnChanges } from '@angular/core';

const selector = 'extension-component';

@Component({
  selector,
  template: '',
})
export class NgExtension implements OnChanges {
  @Input('name') public name: string | undefined;
  @Input('params') public params: object | undefined;

  constructor(private elRef: ElementRef<HTMLElement>, @Inject('piral') private piral: PiletApi) {}

  ngOnChanges() {
    this.elRef.nativeElement.dispatchEvent(
      new CustomEvent('extension-props-changed', {
        detail: {
          name: this.name,
          params: this.params,
        },
      }),
    );
  }

  ngAfterContentInit() {
    this.piral.renderHtmlExtension(this.elRef.nativeElement, {
      name: this.name,
      params: this.params,
    });
  }
}
