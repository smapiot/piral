import { EventEmitter } from 'events';

export interface TarFiles {
  [fileName: string]: string;
}

export interface ReadEntry extends EventEmitter {
  path: string;
  mode: number;
  ignore: boolean;
}

export interface PackageFiles {
  [file: string]: string;
}

export interface PackageData {
  name: string;
  version: string;
  author:
    | string
    | {
        name: string;
        url: string;
        email: string;
      };
  main?: string;
  priority?: number;
  feature?: string | Array<string>;
  dependencies?: {
    [name: string]: string;
  };
  devDependencies?: {
    [name: string]: string;
  };
  peerDependencies?: {
    [name: string]: string;
  };
}
