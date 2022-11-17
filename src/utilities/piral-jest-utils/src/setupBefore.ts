import { TextEncoder, TextDecoder } from 'util';
import { createPiralMockApi } from './mock';
import { runPilet } from './runner';

declare global {
  namespace NodeJS {
    interface Global {
      createPiralMockApi: typeof createPiralMockApi;
      runPilet: typeof runPilet;
    }
  }
}

if (typeof global !== 'undefined') {
  global.matchMedia = () => ({ matches: false } as any);
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0) as any;
  global.createPiralMockApi = createPiralMockApi;
  global.runPilet = runPilet;
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
