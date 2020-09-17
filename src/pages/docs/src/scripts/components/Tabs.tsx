import * as React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';

function toKey(title: string) {
  return title.toLowerCase().split(' ').join('-');
}

function findKey(keys: Array<string>, tab: string) {
  const index = keys.indexOf(tab);
  return index !== -1 ? index : 0;
}

export interface TabsProps extends RouteComponentProps<{ tab: string }> {
  titles: Array<string>;
}

export const Tabs = withRouter<TabsProps, React.FC<TabsProps>>(({ titles, children, match }) => {
  const [keys] = React.useState(() => titles.map(toKey));
  const active = findKey(keys, match.params.tab);

  return (
    <div className="tabs">
      <div className="tabs-header">
        <ul>
          {titles.map((title, i) => (
            <li key={i}>
              <Link replace to={match.path.replace(':tab?', keys[i])} className={i === active ? 'active' : ''}>
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="tabs-content">
        <div className="tab">{React.Children.toArray(children)[active]}</div>
      </div>
    </div>
  );
});
