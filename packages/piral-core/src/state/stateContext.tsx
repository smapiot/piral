import * as React from 'react';
import { GlobalStateContext } from '../types';

export const StateContext = React.createContext<GlobalStateContext>(undefined);

export default StateContext;
