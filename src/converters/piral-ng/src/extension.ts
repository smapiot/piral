import { Component, ElementRef, Input, Inject } from '@angular/core';

export function createExtension(rootName: string, selector: string): any {
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

  return NgExtension;
}
