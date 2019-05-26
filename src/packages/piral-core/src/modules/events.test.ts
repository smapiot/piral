import { createListener } from './events';

describe('Events Module', () => {
  it('add and emit event', done => {
    const events = createListener();
    const mockCallback = jest.fn();
    events.on('init', mockCallback);
    events.emit('init', undefined);

    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
      done();
    }, 1);
  });

  it('emit on empty event should be fine', () => {
    const events = createListener();
    events.emit('init', undefined);
  });

  it('should not be possible to emit after event removed', done => {
    const events = createListener();
    const mockCallback = jest.fn();
    events.on('init', mockCallback);
    events.emit('init', undefined);
    events.off('init', mockCallback);
    events.emit('init', undefined);

    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
      done();
    }, 1);
  });
});
