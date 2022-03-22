import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { ForeignComponentContainer } from './ForeignComponentContainer';

describe('ForeignComponentContainer component', () => {
  it('mounts an HTML component', () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const component = { mount };
    render(
      <ForeignComponentContainer $component={component} $context={undefined} $portalId="foo" innerProps={{}} />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    container.remove();
  });

  it('unmounts an HTML component', () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const unmount = jest.fn();
    const component = { mount, unmount };
    render(
      <ForeignComponentContainer $component={component} $context={undefined} $portalId="foo" innerProps={{}} />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    expect(unmount).not.toHaveBeenCalled();
    unmountComponentAtNode(container);
    expect(unmount).toHaveBeenCalled();
    container.remove();
  });

  it('updates an HTML component', () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const update = jest.fn();
    const component = { mount, update };
    render(
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
    render(
      <ForeignComponentContainer
        $component={component}
        $context={undefined}
        $portalId="foo"
        innerProps={{ a: 'foo' }}
      />,
      container,
    );
    expect(update).toHaveBeenCalled();
    container.remove();
  });

  it('forces re-rendering of an HTML component', () => {
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
    render(
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
    render(
      <ForeignComponentContainer
        $component={component}
        $context={undefined}
        $portalId="foo"
        innerProps={{ a: 'foo' }}
      />,
      container,
    );
    expect(update).not.toHaveBeenCalled();
    expect(unmount).toHaveBeenCalled();
    container.remove();
  });

  it('listens to render-html', () => {
    const container = document.body.appendChild(document.createElement('div'));
    const mount = jest.fn();
    const renderHtmlExtension = jest.fn();
    const component = { mount };
    const props = { piral: { renderHtmlExtension }, meta: {} };
    render(
      <ForeignComponentContainer $component={component} $context={undefined} $portalId="foo" innerProps={props} />,
      container,
    );
    expect(mount).toHaveBeenCalled();
    const node = document.querySelector('[data-portal-id=foo]');
    expect(renderHtmlExtension).not.toHaveBeenCalled();
    node.dispatchEvent(new CustomEvent('render-html', { detail: {} }));
    expect(renderHtmlExtension).toHaveBeenCalled();
    container.remove();
  });
});
