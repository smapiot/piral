import * as React from 'react';
import * as piralCore from 'piral-core';
import * as useForm from './useForm';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { withForm } from './withForm';

jest.mock('piral-core');
jest.mock('./useForm');

const mountWithRouter = (node, url = '/') =>
  mount(
    <MemoryRouter initialEntries={[url]} initialIndex={0}>
      {node}
    </MemoryRouter>,
  );

const StubComponent: React.FC<{ data: any }> = () => <div />;
StubComponent.displayName = 'StubComponent';

const LoaderComponent: React.FC<{ data: any }> = () => <div />;
LoaderComponent.displayName = 'LoaderComponent';

const ErrorComponent: React.FC<{ data: any }> = () => <div />;
ErrorComponent.displayName = 'ErrorComponent';

(piralCore as any).ComponentError = ErrorComponent;
(piralCore as any).ComponentLoader = LoaderComponent;

describe('withForm Module', () => {
  it('shows error component if nothing is loading and no data is available', () => {
    const options: any = { emptyData: {} };
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usePromise = jest.fn(() => ({
      loading: false,
      data: undefined,
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (piralCore as any).usePromise = usePromise;
    const Component: any = withForm(StubComponent, options);
    const node = mountWithRouter(<Component />);
    expect(node.find(ErrorComponent).length).toBe(1);
  });

  it('shows data component if nothing is loading and data is available', () => {
    const options: any = { emptyData: {} };
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usePromise = jest.fn(() => ({
      loading: false,
      data: {},
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (piralCore as any).usePromise = usePromise;
    const Component: any = withForm(StubComponent, options);
    const node = mountWithRouter(<Component />);
    expect(node.find(StubComponent).length).toBe(1);
  });

  it('shows loading component if it is loading', () => {
    const options: any = { emptyData: {} };
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usePromise = jest.fn(() => ({
      loading: true,
      data: undefined,
      error: undefined,
    }));
    (useForm as any).useForm = usedForm;
    (piralCore as any).usePromise = usePromise;
    const Component: any = withForm(StubComponent, options);
    const node = mountWithRouter(<Component />);
    expect(node.find(LoaderComponent).length).toBe(1);
  });

  it('calls load data if its there', () => {
    const loadData = jest.fn(() => () => Promise.resolve({}));
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usePromise = jest.fn(fn => {
      fn();
      return {
        loading: false,
        data: undefined,
        error: undefined,
      };
    });
    (useForm as any).useForm = usedForm;
    (piralCore as any).usePromise = usePromise;
    const options: any = { emptyData: {}, loadData };
    const Component: any = withForm(StubComponent, options);
    mountWithRouter(<Component />);
    expect(usePromise).toHaveBeenCalledTimes(1);
    expect(loadData).toHaveBeenCalledTimes(1);
  });

  it('does not call load data if its missing', () => {
    const loadData = undefined;
    const usedForm = jest.fn(() => ({
      submit() {},
    }));
    const usePromise = jest.fn(fn => {
      const data = fn();
      return {
        loading: false,
        data,
        error: undefined,
      };
    });
    (useForm as any).useForm = usedForm;
    (piralCore as any).usePromise = usePromise;
    const options: any = { emptyData: {}, loadData };
    const Component: any = withForm(StubComponent, options);
    mountWithRouter(<Component />);
    expect(usePromise).toHaveBeenCalledTimes(1);
  });
});
