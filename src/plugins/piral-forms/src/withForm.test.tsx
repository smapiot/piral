import * as React from 'react';
import * as piralCore from 'piral-core';
import * as useForm from './useForm';
import * as usePromise from './usePromise';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { withForm } from './withForm';

jest.mock('piral-core');
jest.mock('./useForm');
jest.mock('./usePromise');

const mountWithRouter = (node, url = '/') =>
  render(
    <MemoryRouter initialEntries={[url]} initialIndex={0}>
      {node}
    </MemoryRouter>,
  );

const StubComponent: React.FC<{ data: any }> = () => <div role="component" />;
StubComponent.displayName = 'StubComponent';

const LoaderComponent: React.FC<{ data: any }> = () => <div role="loader" />;
LoaderComponent.displayName = 'LoaderComponent';

const ErrorComponent: React.FC<{ data: any }> = () => <div role="error" />;
ErrorComponent.displayName = 'ErrorComponent';

(piralCore as any).RegisteredErrorInfo = ErrorComponent;
(piralCore as any).RegisteredLoadingIndicator = LoaderComponent;

describe('withForm Module', () => {
  it('shows error component if nothing is loading and no data is available', () => {
    const options: any = { emptyData: {} };
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usedPromise = jest.fn(() => ({
      loading: false,
      data: undefined,
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const Component: any = withForm(StubComponent, options);
    const node = mountWithRouter(<Component />);
    expect(node.getAllByRole("error").length).toBe(1);
  });

  it('shows data component if nothing is loading and data is available', () => {
    const options: any = { emptyData: {} };
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usedPromise = jest.fn(() => ({
      loading: false,
      data: {},
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const Component: any = withForm(StubComponent, options);
    const node = mountWithRouter(<Component />);
    expect(node.getAllByRole("component").length).toBe(1);
  });

  it('shows loading component if it is loading', () => {
    const options: any = { emptyData: {} };
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usedPromise = jest.fn(() => ({
      loading: true,
      data: undefined,
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (usePromise as any).usePromise = usedPromise;
    const Component: any = withForm(StubComponent, options);
    const node = mountWithRouter(<Component />);
    expect(node.getAllByRole("loader").length).toBe(1);
  });

  it('calls load data if its there', () => {
    const loadData = jest.fn(() => () => Promise.resolve({}));
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usedPromise = jest.fn((fn) => {
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
    mountWithRouter(<Component />);
    expect(usedPromise).toHaveBeenCalledTimes(1);
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  it('does not call load data if its missing', () => {
    const loadData = undefined;
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usedPromise = jest.fn((fn) => {
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
    mountWithRouter(<Component />);
    expect(usedPromise).toHaveBeenCalledTimes(1);
  });
});
