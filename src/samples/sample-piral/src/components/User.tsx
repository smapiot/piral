import * as React from 'react';
import { useGlobalState, useOnClickOutside } from 'piral';
import { withClass } from './utils';

export const User: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const currentUser = useGlobalState(m => m.user);
  const menuItems = useGlobalState(m => m.registry.menuItems);
  const itemNames = Object.keys(menuItems).filter(m => menuItems[m].settings.type === 'user');
  const container = React.useRef<HTMLDivElement>(undefined);
  const image = currentUser ? require('../images/male.png') : require('../images/female.png');
  const items = itemNames.length > 0 && (
    <>
      <li className="sep" />
      {itemNames.map(name => {
        const Component = menuItems[name].component;
        return <Component key={name} />;
      })}
    </>
  );
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
              <span className="user-name">Name</span>
              {currentUser.firstName} {currentUser.lastName}
            </li>
            {items}
            <li className="sep" />
            <li>
              <a href="#">Logout</a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="">Login</a>
            </li>
            {items}
          </>
        )}
      </ul>
    </div>
  );
};
