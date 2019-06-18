import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

interface PlatformProp {
  provide: string;
  useValue: any;
}

export function bootstrap(values: Array<PlatformProp>, mod: any, node: HTMLElement) {
  const platform = platformBrowserDynamic(values);

  return platform
    .bootstrapModule(mod)
    .catch(err => console.log(err))
    .then(() => node.removeAttribute('id'));
}
