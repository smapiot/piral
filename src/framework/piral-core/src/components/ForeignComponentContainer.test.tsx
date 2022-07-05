import * as React from 'react';
import { render as renderDom } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ForeignComponentContainer } from './ForeignComponentContainer';

function resolveAfter(time = 5) {
  return new Promise<void>((resolve) => setTimeout(resolve, time));
}

async function render(element: any, container: Element) {
  renderDom(element, container);
  await act(resolveAfter);
  return () => renderDom(<div />, container);
}

describe('ForeignComponentContainer component', () => {
  it('mounts an HTML component', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const component = { mount };
    await render(
      <ForeignComponentContainer $component={component} $context={undefined} $portalId="foo" innerProps={{}} />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    container.remove();
  });

  it('unmounts an HTML component', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const unmount = jest.fn();
    const component = { mount, unmount };
    const doUnmount = await render(
      <ForeignComponentContainer $component={component} $context={undefined} $portalId="foo" innerProps={{}} />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    expect(unmount).not.toHaveBeenCalled();
    doUnmount();
    expect(unmount).toHaveBeenCalled();
    container.remove();
  });

  it('updates an HTML component', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const update = jest.fn();
    const component = { mount, update };
    await render(
      <ForeignComponentContainer
        $component={component}
        $context={undefined}
        $portalId="foo"
        innerProps={{ a: 'bar' }}
      />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    await render(
      <ForeignComponentContainer
        $component={component}
        $context={undefined}
        $portalId="foo"
        innerProps={{ a: 'foo' }}
      />,
      container,
    );
    await act(resolveAfter);
    expect(update).toHaveBeenCalled();
    container.remove();
  });

  it('forces re-rendering of an HTML component', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const componentDidMount = ForeignComponentContainer.prototype.componentDidMount;
    ForeignComponentContainer.prototype.componentDidMount = function () {
      componentDidMount.call(this);
      this.previous = {
        removeEventListener() {},
      };
    };
    const mount = jest.fn();
    const update = jest.fn();
    const unmount = jest.fn();
    const component = { mount, update, unmount };
    await render(
      <ForeignComponentContainer
        $component={component}
        $context={undefined}
        $portalId="foo"
        innerProps={{ a: 'bar' }}
      />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    expect(unmount).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    await render(
      <ForeignComponentContainer
        $component={component}
        $context={undefined}
        $portalId="foo"
        innerProps={{ a: 'foo' }}
      />,
      container,
    );
    await act(resolveAfter);
    expect(update).not.toHaveBeenCalled();
    expect(unmount).toHaveBeenCalled();
    container.remove();
  });

  it('listens to render-html', async () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const renderHtmlExtension = jest.fn();
    const component = { mount };
    const props = { piral: { renderHtmlExtension }, meta: {} };
    await render(
      <ForeignComponentContainer $component={component} $context={undefined} $portalId="foo" innerProps={props} />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    const node = document.querySelector('[data-portal-id=foo]');
    expect(renderHtmlExtension).not.toHaveBeenCalled();
    node?.dispatchEvent(new CustomEvent('render-html', { detail: {} }));
    await act(resolveAfter);
    expect(renderHtmlExtension).toHaveBeenCalled();
    container.remove();
  });
});
