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

export function addImportRecursively(targetModule: any, importModule: any) {
  const [annotation] = getAnnotations(targetModule);

  if (annotation) {
    const existingImports = annotation.imports || [];
    annotation.imports = [...existingImports, importModule];
    targetModule.ɵinj.imports = [...existingImports, importModule];

    for (const existingImport of existingImports) {
      addImportRecursively(existingImport, importModule);
    }
  }
}
