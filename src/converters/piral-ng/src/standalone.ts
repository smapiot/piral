import { APP_BASE_HREF } from '@angular/common';
import { createApplication } from '@angular/platform-browser';
import {
  ApplicationConfig,
  ApplicationRef,
  ComponentRef,
  Type,
  ɵresetCompiledComponents as reset,
} from '@angular/core';
import type { BaseComponentProps, HtmlComponent } from 'piral-core';
import { CoreRoutingService } from './CoreRoutingService';

export interface NgStandaloneConverter {
  <TProps extends BaseComponentProps>(component: Type<TProps>): HtmlComponent<TProps>;
}

export function createConverter(options: ApplicationConfig): NgStandaloneConverter {
  const update = (ref: ComponentRef<any>, props: any) => {
    if (ref) {
      const ct = ref.componentType as any;

      if (ct?.ɵcmp?.inputs?.Props) {
        ref.setInput('Props', props);
      }
    }
  };

  let app: undefined | Promise<ApplicationRef> = undefined;

  return (component) => ({
    type: 'html',
    component: {
      mount(element, props, ctx, locals) {
        if (!app) {
          const { piral } = props;

          app = createApplication({
            ...options,
            providers: [
              ...options.providers,
              CoreRoutingService,
              { provide: APP_BASE_HREF, useValue: ctx.publicPath },
              { provide: 'Context', useValue: ctx },
              { provide: 'piral', useValue: piral },
            ],
          });

          piral.on('unload-pilet', (ev) => {
            if (ev.name === piral.meta.name && typeof reset === 'function') {
              // pretty much a cleanup step for Angular.
              reset();
            }
          });
        }

        locals.active = true;

        app.then((appRef) => {
          if (locals.active) {
            const ref = appRef.bootstrap(component, element);

            // Start the routing service.
            appRef.injector.get(CoreRoutingService);

            update(ref, props);
            locals.component = ref;
          }
        });
      },
      update(_1, props, _2, locals) {
        update(locals.component, props);
      },
      unmount(element, locals) {
        locals.active = false;
        locals.component?.destroy();
        locals.component = undefined;
        element.remove();
      },
    },
  });
}
