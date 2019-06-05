import * as React from 'react';
import { PiletApi } from 'piral';
import { Link } from 'react-router-dom';

function attachMenu() {
  let count = 0;

  return (api: PiletApi, element: React.ReactElement) => {
    const Item: React.SFC = () => element;
    Item.displayName = 'Item';
    api.registerMenu(`menu_${count++}`, Item, { type: 'general' });
  };
}

const attach = attachMenu();

export function setupMenu(api: PiletApi) {
  attach(api, <Link to="/">Dashboard</Link>);
  attach(api, <Link to="/error">Not Found</Link>);
}
