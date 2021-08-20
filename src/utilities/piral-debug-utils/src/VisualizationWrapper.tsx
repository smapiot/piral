import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { BaseComponentProps, useGlobalState } from 'piral-core';

interface VisualizerProps {
  pilet: string;
  force: boolean;
}

const moduleColor = {};

const Visualizer: React.FC<VisualizerProps> = ({ pilet, force }) => {
  const colors = [
    '#001F3F',
    '#0074D9',
    '#7FDBFF',
    '#39CCCC',
    '#3D9970',
    '#2ECC40',
    '#01FF70',
    '#FFDC00',
    '#FF851B',
    '#FF4136',
    '#85144B',
    '#F012BE',
    '#B10DC9',
  ];
  const location = useLocation();
  const container = React.useRef<HTMLDivElement>();
  const color = React.useMemo(
    () => moduleColor[pilet] || (moduleColor[pilet] = colors[Object.keys(moduleColor).length % colors.length]),
    [pilet],
  );
  const active = force || sessionStorage.getItem('dbg:view-origins') === 'on';

  React.useEffect(() => {
    let sibling = container.current && container.current.nextElementSibling;

    if (sibling && active) {
      const style = container.current.style;
      const target = container.current.parentNode;
      const observer = new MutationObserver(() => {
        const newSibling = container.current.nextElementSibling;

        if (newSibling !== sibling) {
          sibling = newSibling;
          sibling.addEventListener('mouseover', mouseIn);
          sibling.addEventListener('mouseout', mouseOut);
        }
      });

      const mouseIn = () => {
        style.display = 'block';
        style.left = '0px';
        style.top = '0px';
        style.bottom = '0px';
        style.right = '0px';
        const targetRect = sibling.getBoundingClientRect();
        const sourceRect = container.current.getBoundingClientRect();
        style.left = targetRect.left - sourceRect.left + 'px';
        style.top = targetRect.top - sourceRect.top + 'px';
        style.bottom = -(targetRect.bottom - sourceRect.bottom) + 'px';
        style.right = -(targetRect.right - sourceRect.right) + 'px';
      };
      const mouseOut = () => {
        style.display = 'none';
      };

      sibling.addEventListener('mouseover', mouseIn);
      sibling.addEventListener('mouseout', mouseOut);
      observer.observe(target, { childList: true });

      return () => {
        sibling.removeEventListener('mouseover', mouseIn);
        sibling.removeEventListener('mouseout', mouseOut);
        observer.disconnect();
      };
    }
  }, [location.key, active]);

  if (active) {
    const rect: React.CSSProperties = {
      border: '1px solid red',
      display: 'none',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 99999999999,
      pointerEvents: 'none',
      borderColor: color,
    };
    const info: React.CSSProperties = {
      color: 'white',
      position: 'absolute',
      right: 0,
      top: 0,
      fontSize: '8px',
      background: color,
    };

    return (
      <div style={rect} ref={container}>
        <div style={info} title={pilet} />
      </div>
    );
  }

  // tslint:disable-next-line:no-null-keyword
  return null;
};

export const VisualizationWrapper: React.FC<BaseComponentProps> = ({ piral, children }) => {
  const forced = useGlobalState((m) => m.$debug.visualize);
  return (
    <>
      <Visualizer pilet={piral.meta.name} force={forced} />
      {children}
    </>
  );
};
