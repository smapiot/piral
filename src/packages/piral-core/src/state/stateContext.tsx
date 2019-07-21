import * as React from 'react';
import { GlobalStateContext } from '../types';

export const StateContext = React.createContext<GlobalStateContext<any>>(undefined);

export default StateContext;
