import * as React from 'react';
import { useGlobalState, useTranslation, useOnClickOutside } from 'piral';
import { withClass } from './utils';

export const User: React.SFC = () => {
  const [open, setOpen] = React.useState(false);
  const currentUser = useGlobalState(m => m.user.current);
  const { name, logout, login } = useTranslation();
  const container = React.useRef<HTMLDivElement>(undefined);
  const image = currentUser ? require('../images/male.png') : require('../images/female.png');
  useOnClickOutside(container, () => setOpen(false));

  return (
    <div className={withClass('app-user', open && 'is-open')} ref={container}>
      <div className="app-user-avatar" onClick={() => setOpen(!open)}>
        <img src={image} alt="Profile Image" />
      </div>
      <ul className="app-user-details">
        {currentUser ? (
          <>
            <li>
              <span className="user-name">{name}</span>
              {currentUser.firstName} {currentUser.lastName}
            </li>
            <li className="sep" />
            <li>
              <a href="#">{logout}</a>
            </li>
          </>
        ) : (
          <li>
            <a href="">{login}</a>
          </li>
        )}
      </ul>
    </div>
  );
};
