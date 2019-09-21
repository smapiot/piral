import { createElement, SFC } from 'react';
import { createFormsApi } from './create';

const StubComponent: SFC = props => createElement('div', props);
StubComponent.displayName = 'StubComponent';

function createMockContainer() {
  return {
    context: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      defineActions() {},
    } as any,
    api: {} as any,
  };
}

describe('Create Forms API Extensions', () => {
  it('createCoreApi allows using the created form creator as a HOC', () => {
    const container = createMockContainer();
    container.context.updateFormState = jest.fn();
    const api = createFormsApi(container.context);
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
