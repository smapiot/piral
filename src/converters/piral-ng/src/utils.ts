import { VERSION, StaticProvider } from '@angular/core';

export interface NgAnnotation {
  _initial?: Array<StaticProvider>;
  standalone?: boolean;
  providers: Array<StaticProvider>;
  imports: Array<any>;
  exports: Array<any>;
  declarations: Array<any>;
  entryComponents: Array<any>;
  bootstrap: any;
  selector: string;
}

export function getId() {
  return Math.random().toString(36);
}

export function getNgVersion() {
  return VERSION.major || VERSION.full.split('.')[0];
}

export function getMinVersion() {
  const major = getNgVersion();
  return `${major}.0.0`;
}

export function getAnnotations(component: any): Array<NgAnnotation> {
  let annotations = component?.__annotations__;

  if (!annotations && typeof Reflect !== 'undefined' && 'getOwnMetadata' in Reflect) {
    annotations = (Reflect as any).getOwnMetadata('annotations', component);
  }

  if (!annotations && typeof component.ɵcmp !== 'undefined') {
    annotations = [{}];
  }

  if (!annotations && typeof component.ɵmod !== 'undefined') {
    annotations = [component.ɵmod];
  }

  return annotations || [];
}

export function hasSelector(component: any, selector: string) {
  const [annotation] = getAnnotations(component);
  return annotation && annotation.selector === selector;
}

export function findComponents(exports: Array<any>): Array<any> {
  const components = [];

  if (Array.isArray(exports)) {
    for (const ex of exports) {
      const [annotation] = getAnnotations(ex);

      if (annotation) {
        if (annotation.exports) {
          components.push(...findComponents(annotation.exports));
        } else if (!annotation.imports || annotation.standalone) {
          components.push(ex);
        }
      }
    }
  }

  return components;
}
