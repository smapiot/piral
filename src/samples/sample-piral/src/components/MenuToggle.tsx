import * as React from 'react';
import { withRouter } from 'react-router';
import { withClass } from './utils';

export const MenuToggle = withRouter(({ history }) => {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const node = document.querySelector('.app-menu');

    if (active) {
      node.classList.add('is-open');
    } else {
      node.classList.remove('is-open');
    }
    return history.listen(() => active && setActive(false));
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
});
