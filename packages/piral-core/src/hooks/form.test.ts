import * as React from 'react';
import * as prompt from './prompt';
import * as globalState from './globalState';
import * as action from './action';
import { useForm } from './form';

jest.mock('react');

(React as any).useState = jest.fn(idOrFn => [typeof idOrFn === 'function' ? idOrFn() : idOrFn]);
(React as any).useEffect = jest.fn(cb => cb());

describe('Form Hook Module', () => {
  it('Returns the current data and not changed initially', () => {
    const promptFake = jest.fn();
    const setStateFake = jest.fn();
    const actionFake = jest.fn(() => setStateFake);
    (prompt as any).usePrompt = promptFake;
    (action as any).useAction = actionFake;
    (globalState as any).useGlobalState = (select: any) =>
      select({
        forms: {
          foo: {
            changed: false,
            currentData: {},
            initialData: {},
            submitting: false,
            error: undefined,
          },
        },
      });
    const options = {
      wait: false,
      silent: false,
      message: '',
      onSubmit() {
        return Promise.resolve();
      },
      onChange: undefined,
      emptyData: {},
    };
    const { changed, submitting, formData } = useForm({}, undefined, options, 'foo');
    expect(changed).toBeFalsy();
    expect(submitting).toBeFalsy();
    expect(formData).toEqual({});
    expect(setStateFake.mock.calls[0][0].length).toBe(3);
  });

  it('Generates a new id if the old one is not provided', () => {
    const promptFake = jest.fn();
    const setStateFake = jest.fn();
    const actionFake = jest.fn(() => setStateFake);
    (prompt as any).usePrompt = promptFake;
    (action as any).useAction = actionFake;
    (globalState as any).useGlobalState = (select: any) =>
      select({
        forms: {},
      });
    const options = {
      wait: false,
      silent: false,
      message: '',
      onSubmit() {
        return Promise.resolve();
      },
      onChange: undefined,
      emptyData: {},
    };
    const { changed, submitting, formData } = useForm({}, undefined, options);
    expect(changed).toBeFalsy();
    expect(submitting).toBeFalsy();
    expect(formData).toEqual({});
    expect(setStateFake.mock.calls[0][0].length).toBe(36);
  });

  it('Submit with no changed data does nothing', () => {
    const onSubmit = jest.fn(() => Promise.resolve());
    const promptFake = jest.fn();
    const setStateFake = jest.fn();
    const actionFake = jest.fn(() => setStateFake);
    (prompt as any).usePrompt = promptFake;
    (action as any).useAction = actionFake;
    (globalState as any).useGlobalState = (select: any) =>
      select({
        forms: {},
      });
    const options = {
      wait: false,
      silent: false,
      message: '',
      onSubmit,
      onChange: undefined,
      emptyData: {},
    };
    const { changed, submitting, formData, submit } = useForm({}, undefined, options);
    submit();
    expect(changed).toBeFalsy();
    expect(submitting).toBeFalsy();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(formData).toEqual({});
    expect(setStateFake.mock.calls[0][0].length).toBe(36);
  });

  it('Submit with changed data submits successfully', () => {
    const onSubmit = jest.fn(() => Promise.resolve());
    const promptFake = jest.fn();
    const setStateFake = jest.fn();
    const actionFake = jest.fn(() => setStateFake);
    (prompt as any).usePrompt = promptFake;
    (action as any).useAction = actionFake;
    (globalState as any).useGlobalState = (select: any) =>
      select({
        forms: {
          foo: {
            changed: true,
            currentData: {
              a: 'foo',
            },
            initialData: {
              a: '',
            },
            submitting: false,
            error: undefined,
          },
        },
      });
    const options = {
      wait: false,
      silent: false,
      message: '',
      onSubmit,
      onChange: undefined,
      emptyData: {},
    };
    const { changed, formData, submit } = useForm({}, undefined, options, 'foo');
    submit();
    expect(changed).toBeTruthy();
    expect(onSubmit).toHaveBeenCalledWith({
      a: 'foo',
    });
    expect(formData).toEqual({
      a: 'foo',
    });
  });
});
