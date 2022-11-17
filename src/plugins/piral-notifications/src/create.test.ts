import create from 'zustand';
import { createNotificationsApi } from './create';

function createMockContainer() {
  const state = create(() => ({
    registry: {
      extensions: {},
    },
  }));
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
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
    container.context.openNotification = jest.fn();
    container.context.closeNotification = jest.fn();
    const api = (createNotificationsApi()(container.context) as any)(container.api);
    const close = api.showNotification('my notification');
    close();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(container.context.openNotification).toHaveBeenCalled();
    expect(container.context.closeNotification).toHaveBeenCalled();
  });

  it('createCoreApi showNotification can be auto closed', () => {
    jest.useFakeTimers();
    const container = createMockContainer();
    container.context.openNotification = jest.fn();
    container.context.closeNotification = jest.fn();
    const api = (createNotificationsApi()(container.context) as any)(container.api);
    api.showNotification('my notification', {
      autoClose: 100,
    });
    expect(container.context.openNotification).toHaveBeenCalled();
    expect(container.context.closeNotification).not.toHaveBeenCalled();
    jest.advanceTimersByTime(120);
    expect(container.context.closeNotification).toHaveBeenCalled();
  });
});
