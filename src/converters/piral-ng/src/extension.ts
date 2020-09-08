import { Component, ElementRef, Input, Inject, enableProdMode } from '@angular/core';

export function createExtension(rootName = 'slot', selector = 'extension-component'): any {
  const template = `<${rootName}></${rootName}>`;

  @Component({
    selector,
    template,
  })
  class NgExtension {
    @Input('name') public name: string;
    @Input('params') public params: object;

    constructor(private elRef: ElementRef<HTMLElement>, @Inject('piral') private piral: any) {}

    ngAfterContentInit() {
      this.piral.renderHtmlExtension(this.elRef.nativeElement, {
        name: this.name,
        params: this.params,
      });
    }
  }

  if (process.env.ENV === 'production') {
    enableProdMode();
  }

  return NgExtension;
}
