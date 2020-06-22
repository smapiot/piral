import { createPilet } from './aggregate';

describe('Piral-Base aggregate module', () => {
  it('createPilet calls the setup method of the pilet', async () => {
    const create: any = jest.fn(() => ({}));
    const setup = jest.fn();
    await createPilet(create, {
      name: 'any',
      version: '1.0.0',
      hash: '123',
      setup,
    });
    expect(create).toBeCalled();
    expect(setup).toBeCalled();
  });

  it('createPilet does not call due to invalid api creator', async () => {
    const setup = jest.fn();
    await createPilet(undefined, {
      name: 'any',
      version: '1.0.0',
      hash: '123',
      setup: 5 as any,
    });
    expect(setup).not.toBeCalled();
  });
});
