/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vitest } from 'vitest';
import { createListener } from './events';

describe('Events Module', () => {
  it('add and emit event', () => {
    const events = createListener(undefined);
    const mockCallback = vitest.fn();
    events.on('init', mockCallback);
    events.emit('init', undefined);

    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
    }, 1);
  });

  it('does only react to self events when different states', () => {
    const events1 = createListener({});
    const events2 = createListener({});
    const mockCallback = vitest.fn();
    events1.on('init', mockCallback);
    events2.emit('init', undefined);

    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledTimes(0);
    }, 1);
  });

  it('does only react to self events when same state', () => {
    const state = {};
    const events1 = createListener(state);
    const events2 = createListener(state);
    const mockCallback = vitest.fn();
    events1.on('init', mockCallback);
    events2.emit('init', undefined);

    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
    }, 1);
  });

  it('emit on empty event should be fine', () => {
    const events = createListener(undefined);
    events.emit('init', undefined);
  });

  it('should not try to remove non-existing listener', () => {
    const events = createListener(undefined);
    events.off('init', vitest.fn());
  });

  it('should not be possible to emit after event removed', () => {
    const events = createListener(undefined);
    const mockCallback = vitest.fn();
    events.on('init', mockCallback);
    events.emit('init', undefined);
    events.off('init', mockCallback);
    events.emit('init', undefined);

    setTimeout(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
    }, 1);
  });
});
