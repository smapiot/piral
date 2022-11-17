import create from 'zustand';
import { createElement, FC } from 'react';
import { createFormsApi } from './create';

const StubComponent: FC = (props) => createElement('div', props);
StubComponent.displayName = 'StubComponent';

function createMockContainer() {
  const state = create(() => ({}));
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

describe('Create Forms API Extensions', () => {
  it('createCoreApi allows using the created form creator as a HOC', () => {
    const container = createMockContainer();
    container.context.updateFormState = jest.fn();
    const api = createFormsApi()(container.context) as any;
    const create = api.createForm({
      emptyData: {},
      onSubmit() {
        return Promise.resolve();
      },
    });
    const NewComponent = create(StubComponent);
    expect(NewComponent.displayName).toBe('withRouter(FormLoader)');
  });
});
