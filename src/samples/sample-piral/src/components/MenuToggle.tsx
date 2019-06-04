import * as React from 'react';
import { withClass } from './utils';

export const MenuToggle: React.SFC = () => {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (active) {
      document.querySelector('.pi-menu').classList.add('is-open');
    } else {
      document.querySelector('.pi-menu').classList.remove('is-open');
    }
    return () => {};
  }, [active]);

  return (
    <button
      className={withClass('hamburger hamburger--arrow', active && 'is-active')}
      type="button"
      onClick={() => setActive(!active)}>
      <span className="hamburger-box">
        <span className="hamburger-inner" />
      </span>
    </button>
  );
};
