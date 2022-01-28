import * as React from 'react';
import { usePrompt } from './usePrompt';

describe('Prompt Hook Module', () => {
  it('does not do anything when its not active', () => {
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    const usedEffect = jest.fn();
    const history = {
      block: jest.fn(() => () => {}),
      listen: jest.fn(() => () => {}),
    };
    (React as any).useEffect = usedEffect;
    usePrompt(false, history as any, 'blocked');
    const dispose = usedEffect.mock.calls[0][0]();
    dispose();
    expect(usedEffect).toBeCalled();
    expect(window.addEventListener).not.toBeCalled();
    expect(window.removeEventListener).not.toBeCalled();
    expect(history.block).not.toBeCalled();
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('does integrate blockers when its active', () => {
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    const usedEffect = jest.fn();
    const history = {
      block: jest.fn(() => () => {}),
      listen: jest.fn(() => () => {}),
    };
    (React as any).useEffect = usedEffect;
    usePrompt(true, history as any, 'blocked');
    const dispose = usedEffect.mock.calls[0][0]();
    dispose();
    expect(usedEffect).toBeCalled();
    expect(window.addEventListener).toBeCalled();
    expect(window.removeEventListener).toBeCalled();
    expect(history.block).toBeCalled();
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('returns with the provided message when the blocker is triggered', () => {
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    const usedEffect = jest.fn();
    const history = {
      block: jest.fn(() => () => {}),
      listen: jest.fn(() => () => {}),
    };
    (React as any).useEffect = usedEffect;
    usePrompt(true, history as any, 'blocked');
    const dispose = usedEffect.mock.calls[0][0]();
    const msg = (window.addEventListener as any).mock.calls[0][1]({});
    dispose();
    expect(msg).toBe('blocked');
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });

  it('returns with the message from the callback when the blocker is triggered', () => {
    const originalAdd = window.addEventListener;
    const originalRemove = window.addEventListener;
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
    const usedEffect = jest.fn();
    const history = {
      block: jest.fn(() => () => {}),
      listen: jest.fn(() => () => {}),
    };
    (React as any).useEffect = usedEffect;
    usePrompt(true, history as any, () => 'block!');
    const dispose = usedEffect.mock.calls[0][0]();
    const msg = (window.addEventListener as any).mock.calls[0][1]({});
    dispose();
    expect(msg).toBe('block!');
    window.addEventListener = originalAdd;
    window.removeEventListener = originalRemove;
  });
});
