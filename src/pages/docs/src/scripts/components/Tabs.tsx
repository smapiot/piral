import * as React from 'react';

export interface TabsProps {
  titles: Array<string>;
  children: Array<React.ReactChild>;
}

export const Tabs: React.FC<TabsProps> = ({ titles, children }) => {
  const [active, setActive] = React.useState(0);
  return (
    <div className="tabs">
      <div className="tabs-header">
        <ul>
          {titles.map((title, i) => (
            <li key={i}>
              <a
                href="#"
                className={i === active ? 'active' : ''}
                onClick={e => {
                  setActive(i);
                  e.preventDefault();
                }}>
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="tabs-content">
        {children.map((child, i) => (
          <div key={i} className={`tab ${i === active ? 'visible' : 'hidden'}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
