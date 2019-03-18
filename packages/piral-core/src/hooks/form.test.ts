import * as React from 'react';
import * as prompt from './prompt';
import * as globalState from './globalState';
import { useForm } from './form';

jest.mock('react');

describe('Form Hook Module', () => {
  it('Returns the current data and changed value', () => {
    const pseudoState = {
      forms: {
        foo: {
          changed: false,
          currentData: undefined,
          initialData: {},
          submitting: false,
          error: undefined,
        },
      },
    };
    const promptFake = jest.fn();
    (React as any).useContext = () => ({
      resetForm: jest.fn(),
      changeForm: jest.fn(),
      submitForm: jest.fn(),
    });
    (prompt as any).usePrompt = promptFake;
    (globalState as any).useGlobalState = (select: any) => select(pseudoState);
    const { changed, submitting, formData } = useForm(
      {
        id: 'foo',
      } as any,
      undefined,
    );
    expect(changed).toBeFalsy();
    expect(submitting).toBeFalsy();
    expect(formData).toBeUndefined();
  });
});
