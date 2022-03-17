import { useSetter } from './setter';

describe('UseSetter Hook Module', () => {
  it('UseSetter', () => {
    const cb = () => {
      return;
    };
    useSetter(cb);
  });
});
