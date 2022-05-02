import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import TestUtils from 'react-dom/test-utils';
import { configure } from 'enzyme';
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

function hideCreateRootWarning(host: any, fn: string) {
  const original = host[fn];

  host[fn] = function (...args) {
    const display = console.error;
    console.error = (...args) => {
      if (!args[0].includes('ReactDOM.render')) {
        display(...args);
      }
    };
    const res = original.call(this, ...args);
    console.error = display;
    return res;
  };
}

const adapter = new Adapter();

hideCreateRootWarning(Adapter.prototype, 'createMountRenderer');
hideCreateRootWarning(TestUtils, 'act');

configure({
  adapter,
});

if (typeof global !== 'undefined') {
  global.matchMedia = () => ({ matches: false } as any);
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0) as any;
  global.createPiralMockApi = createPiralMockApi;
  global.runPilet = runPilet;
}
