import { useSetter } from './setter';

describe('UseSetter Hook Module', () => {
  it('UseSetter', () => {
    const fun = () => {
      const x = 'test';
    };
    useSetter(fun);
  });
});
