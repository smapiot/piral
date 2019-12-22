import { ElmModule } from './lib/types';

declare module '*.elm' {
  export const Elm: {
    [name: string]: ElmModule<any>;
  };
}

export * from './lib/types';
