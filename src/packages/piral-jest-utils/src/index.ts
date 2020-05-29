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
  global.createPiralMockApi = createPiralMockApi;
  global.runPilet = runPilet;
}

export { runPilet, createPiralMockApi };
