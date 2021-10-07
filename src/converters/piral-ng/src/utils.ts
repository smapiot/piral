import type { StaticProvider } from '@angular/core';

export interface NgAnnotation {
  _initial?: Array<StaticProvider>;
  providers: Array<StaticProvider>;
  imports: Array<any>;
  exports: Array<any>;
  declarations: Array<any>;
  entryComponents: Array<any>;
  bootstrap: any;
  selector: string;
}

export function getAnnotations(component: any): Array<NgAnnotation> {
  let annotations = component?.__annotations__;

  if (!annotations && typeof Reflect !== 'undefined' && 'getOwnMetadata' in Reflect) {
    annotations = (Reflect as any).getOwnMetadata('annotations', component);
  }

  return annotations || [];
}

export function findComponents(exports: Array<any>): Array<any> {
  const components = [];

  if (exports && Array.isArray(exports)) {
    for (const ex of exports) {
      const [annotation] = getAnnotations(ex);
  
      if (annotation) {
        if (annotation.exports) {
          components.push(...findComponents(annotation.exports));
        } else if (!annotation.imports) {
          components.push(ex);
        }
      }
    }
  }

  return components;
}

export function addImportRecursively(targetModule: any, importModule: any) {
  const [annotation] = getAnnotations(targetModule);

  if (annotation) {
    const existingImports = annotation.imports || [];
    annotation.imports = [...existingImports, importModule];

    if ('ɵinj' in targetModule) {
      targetModule.ɵinj.imports = annotation.imports;
    }

    for (const existingImport of existingImports) {
      addImportRecursively(existingImport, importModule);
    }
  }
}
