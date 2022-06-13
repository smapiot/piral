import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import TestUtils from 'react-dom/test-utils';
import { configure } from 'enzyme';

function hideCreateRootWarning(host: any, fn: string) {
  const original = host[fn];

  host[fn] = function (...args) {
    const display = console.error;
    console.error = (...args) => {
      if (args.length === 0 || typeof args[0] !== 'string' || !args[0].includes('ReactDOM.render')) {
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
