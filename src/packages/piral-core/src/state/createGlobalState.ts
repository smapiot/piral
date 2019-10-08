import { Atom, addChangeHandler } from '@dbeining/react-atom';
import { DefaultErrorInfo, DefaultLoader } from '../components/default';
import { GlobalState, NestedPartial } from '../types';

export function createGlobalState<TState extends GlobalState>(state: NestedPartial<TState> = {}) {
  const globalState = Atom.of({
    modules: [],
    ...state,
    app: {
      layout: 'desktop',
      components: {
        ErrorInfo: DefaultErrorInfo,
        Loader: DefaultLoader,
      },
      routes: {},
      data: {},
      loading: false,
      ...state.app,
    },
    components: {
      extensions: {},
      pages: {},
      ...state.components,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    addChangeHandler(globalState, 'debugging', ({ current, previous }) => {
      const action = new Error().stack.split('\n')[6].replace(/^\s+at\s+Atom\./, '');
      console.group(
        `%c Piral State Change %c ${new Date().toLocaleTimeString()}`,
        'color: gray; font-weight: lighter;',
        'color: black; font-weight: bold;',
      );
      console.log('%c Previous', `color: #9E9E9E; font-weight: bold`, previous);
      console.log('%c Action', `color: #03A9F4; font-weight: bold`, action);
      console.log('%c Next', `color: #4CAF50; font-weight: bold`, current);
      console.groupEnd();
    });
  }

  return globalState;
}
