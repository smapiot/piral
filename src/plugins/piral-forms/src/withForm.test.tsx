/**
 * @vitest-environment jsdom
 */
import * as React from 'react';
import * as piralCore from 'piral-core';
import * as useForm from './useForm';
import * as usePromise from './usePromise';
import { describe, it, expect, vitest } from 'vitest';
import { render } from '@testing-library/react';
import { withForm } from './withForm';

vitest.mock('piral-core');
vitest.mock('./useForm');
vitest.mock('./usePromise');

const StubComponent: React.FC<{ data: any }> = () => <div role="component" />;
StubComponent.displayName = 'StubComponent';

const LoaderComponent: React.FC<{ data: any }> = () => <div role="loader" />;
LoaderComponent.displayName = 'LoaderComponent';

const ErrorComponent: React.FC<{ data: any }> = () => <div role="error" />;
ErrorComponent.displayName = 'ErrorComponent';

(piralCore as any).RegisteredErrorInfo = ErrorComponent;
(piralCore as any).RegisteredLoadingIndicator = LoaderComponent;
(piralCore as any).useGlobalStateContext = vitest.fn(() => ({
  navigation: {},
}));

describe('withForm Module', () => {
  it('shows error component if nothing is loading and no data is available', () => {
    const options: any = { emptyData: {} };
    const usedForm = vitest.fn(() => ({
      submit() {},
    }));
    const usedPromise = vitest.fn(() => ({
      loading: false,
      data: undefined,
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const Component: any = withForm(StubComponent, options);
    const node = render(<Component />);
    expect(node.getAllByRole('error').length).toBe(1);
  });

  it('shows data component if nothing is loading and data is available', () => {
    const options: any = { emptyData: {} };
    const usedForm = vitest.fn(() => ({
      submit() {},
    }));
    const usedPromise = vitest.fn(() => ({
      loading: false,
      data: {},
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const Component: any = withForm(StubComponent, options);
    const node = render(<Component />);
    expect(node.getAllByRole('component').length).toBe(1);
  });

  it('shows loading component if it is loading', () => {
    const options: any = { emptyData: {} };
    const usedForm = vitest.fn(() => ({
      submit() {},
    }));
    const usedPromise = vitest.fn(() => ({
      loading: true,
      data: undefined,
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const Component: any = withForm(StubComponent, options);
    const node = render(<Component />);
    expect(node.getAllByRole('loader').length).toBe(1);
  });

  it('calls load data if its there', () => {
    const loadData = vitest.fn(() => () => Promise.resolve({}));
    const usedForm = vitest.fn(() => ({
      submit() {},
    }));
    const usedPromise = vitest.fn((fn) => {
      fn();
      return {
        loading: false,
        data: undefined,
        error: undefined,
      };
    });
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const options: any = { emptyData: {}, loadData };
    const Component: any = withForm(StubComponent, options);
    render(<Component />);
    expect(usedPromise).toHaveBeenCalledTimes(1);
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  it('does not call load data if its missing', () => {
    const loadData = undefined;
    const usedForm = vitest.fn(() => ({
      submit() {},
    }));
    const usedPromise = vitest.fn((fn) => {
      const data = fn();
      return {
        loading: false,
        data,
        error: undefined,
      };
    });
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const options: any = { emptyData: {}, loadData };
    const Component: any = withForm(StubComponent, options);
    render(<Component />);
    expect(usedPromise).toHaveBeenCalledTimes(1);
  });
});
