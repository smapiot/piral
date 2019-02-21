import * as React from 'react';
import { useOnClickOutside } from './onClickOutside';

jest.mock('react');

describe('OnClickOutside Module', () => {
  it('is properly hooked on when initiating the effect', () => {
    const usedEffect = jest.fn();
    const originalAdd = document.addEventListener;
    const originalRemove = document.addEventListener;
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();
    (React as any).useEffect = usedEffect;
    useOnClickOutside({ current: {} as any }, jest.fn());
    expect(usedEffect).toHaveBeenCalled();
    const cleanup = usedEffect.mock.calls[0][0]();
    cleanup();
    expect(document.addEventListener).toHaveBeenCalledTimes(2);
    document.addEventListener = originalAdd;
    document.removeEventListener = originalRemove;
  });

  it('is properly cleaned up when leaving the effect', () => {
    const usedEffect = jest.fn();
    const originalAdd = document.addEventListener;
    const originalRemove = document.addEventListener;
    document.addEventListener = jest.fn();
    document.removeEventListener = jest.fn();
    (React as any).useEffect = usedEffect;
    useOnClickOutside({ current: {} as any }, jest.fn());
    expect(usedEffect).toHaveBeenCalled();
    const cleanup = usedEffect.mock.calls[0][0]();
    cleanup();
    expect(document.removeEventListener).toHaveBeenCalledTimes(2);
    document.addEventListener = originalAdd;
    document.removeEventListener = originalRemove;
  });

  it('not calling the handler on mousedown if no ref is available', () => {
    const usedEffect = jest.fn();
    const handler = jest.fn();
    (React as any).useEffect = usedEffect;
    useOnClickOutside({ current: undefined }, handler);
    const cleanup = usedEffect.mock.calls[0][0]();
    const event = new Event('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);
    cleanup();
    expect(handler).not.toHaveBeenCalled();
  });

  it('not calling the handler on mousedown if ref is available, but contains the node', () => {
    const usedEffect = jest.fn();
    const handler = jest.fn();
    (React as any).useEffect = usedEffect;
    useOnClickOutside(
      {
        current: {
          contains() {
            return true;
          },
        } as any,
      },
      handler,
    );
    const cleanup = usedEffect.mock.calls[0][0]();
    const event = new Event('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);
    cleanup();
    expect(handler).not.toHaveBeenCalled();
  });

  it('called the handler on mousedown if ref is available and does not contain node', () => {
    const usedEffect = jest.fn();
    const handler = jest.fn();
    (React as any).useEffect = usedEffect;
    useOnClickOutside(
      {
        current: {
          contains() {
            return false;
          },
        } as any,
      },
      handler,
    );
    const cleanup = usedEffect.mock.calls[0][0]();
    const event = new Event('mousedown', { bubbles: true });
    document.body.dispatchEvent(event);
    cleanup();
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('called the handler on touchstart if ref is available and does not contain node', () => {
    const usedEffect = jest.fn();
    const handler = jest.fn();
    (React as any).useEffect = usedEffect;
    useOnClickOutside(
      {
        current: {
          contains() {
            return false;
          },
        } as any,
      },
      handler,
    );
    const cleanup = usedEffect.mock.calls[0][0]();
    const event = new Event('touchstart', { bubbles: true });
    document.body.dispatchEvent(event);
    cleanup();
    expect(handler).toHaveBeenCalledWith(event);
  });
});
