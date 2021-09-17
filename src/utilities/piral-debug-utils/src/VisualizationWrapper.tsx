import * as React from 'react';
import type { PiletApi } from 'piral-base';
import { useDebugState } from './state';

interface VisualizerProps {
  pilet: string;
  force: boolean;
  active: boolean;
}

const moduleColor = {};

const Visualizer: React.FC<VisualizerProps> = ({ pilet, force, active }) => {
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
  const container = React.useRef<HTMLDivElement>();
  const color = React.useMemo(
    () => moduleColor[pilet] || (moduleColor[pilet] = colors[Object.keys(moduleColor).length % colors.length]),
    [pilet],
  );

  React.useEffect(() => {
    let sibling = container.current && (container.current.nextElementSibling as HTMLElement);

    if (sibling && active) {
      const target = container.current.parentNode;

      const mouseIn = () => {
        if (container.current && sibling) {
          const style = container.current.style;
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
        }
      };
      const mouseOut = () => {
        if (container.current) {
          const style = container.current.style;
          style.display = 'none';
        }
      };
      const append = () => {
        if (force) {
          mouseIn();
        } else if (sibling) {
          sibling.addEventListener('mouseover', mouseIn);
          sibling.addEventListener('mouseout', mouseOut);
        }
      };
      const remove = () => {
        if (force) {
          mouseOut();
        } else if (sibling) {
          sibling.removeEventListener('mouseover', mouseIn);
          sibling.removeEventListener('mouseout', mouseOut);
        }
      };

      const observer = new MutationObserver(() => {
        const newSibling = container.current?.nextElementSibling as HTMLElement;

        if (newSibling !== sibling) {
          remove();
          sibling = newSibling;
          append();
        }
      });

      append();
      observer.observe(target, { childList: true });

      return () => {
        remove();
        observer.disconnect();
      };
    }
  }, [active, force]);

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
        <div style={info}>{pilet}</div>
      </div>
    );
  }

  // tslint:disable-next-line:no-null-keyword
  return null;
};

export interface VisualizationWrapperProps {
  piral: PiletApi;
}

export const VisualizationWrapper: React.FC<VisualizationWrapperProps> = ({ piral, children }) => {
  const { active, force } = useDebugState((m) => m.visualize);
  return (
    <>
      <Visualizer pilet={piral.meta.name} force={force} active={active} />
      {children}
    </>
  );
};
