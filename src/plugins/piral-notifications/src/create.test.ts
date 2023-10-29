/**
 * @vitest-environment jsdom
 */
import create from 'zustand';
import { describe, it, expect, vitest } from 'vitest';
import { createNotificationsApi } from './create';

function createMockContainer() {
  const state = create(() => ({
    registry: {
      extensions: {},
    },
  }));
  return {
    context: {
      on: vitest.fn(),
      off: vitest.fn(),
      emit: vitest.fn(),
      defineActions() {},
      state,
      dispatch(update) {
        state.setState(update(state.getState()));
      },
    } as any,
    api: {} as any,
  };
}

describe('Create Notifications API Extensions', () => {
  it('createCoreApi showNotification uses an action and leaves a disposer', async () => {
    const container = createMockContainer();
    container.context.openNotification = vitest.fn();
    container.context.closeNotification = vitest.fn();
    const api = (createNotificationsApi()(container.context) as any)(container.api);
    const close = api.showNotification('my notification');
    close();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(container.context.openNotification).toHaveBeenCalled();
    expect(container.context.closeNotification).toHaveBeenCalled();
  });

  it('createCoreApi showNotification can be auto closed', () => {
    vitest.useFakeTimers();
    const container = createMockContainer();
    container.context.openNotification = vitest.fn();
    container.context.closeNotification = vitest.fn();
    const api = (createNotificationsApi()(container.context) as any)(container.api);
    api.showNotification('my notification', {
      autoClose: 100,
    });
    expect(container.context.openNotification).toHaveBeenCalled();
    expect(container.context.closeNotification).not.toHaveBeenCalled();
    vitest.advanceTimersByTime(120);
    expect(container.context.closeNotification).toHaveBeenCalled();
  });
});
