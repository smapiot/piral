import * as React from 'react';
import { InitialMenuItem } from 'piral';
import { Link } from 'react-router-dom';

function attach(element: React.ReactElement): InitialMenuItem {
  return {
    settings: {
      type: 'general',
    },
    component: () => element,
  };
}

export function setupMenu() {
  return [attach(<Link to="/">Home</Link>), attach(<Link to="/error">Not Found</Link>)];
}
