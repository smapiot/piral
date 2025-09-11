import * as React from 'react';

import { RegisteredErrorInfo, RegisteredLoadingIndicator } from './components';
import { defer } from '../utils';
import type { Errors, PiletApi } from '../types';

export interface ErrorBoundaryProps {
  /**
   * The type of error to indicate when caught.
   */
  errorType: keyof Errors;
  /**
   * The associated pilet api for the metadata.
   */
  piral: PiletApi;
  /**
   * The content to render (i.e., where to apply the boundary to).
   */
  children: React.ReactNode;
}

export interface ErrorBoundaryState {
  /**
   * The current error (if any) caught by the boundary.
   */
  error?: Error;
}

/**
 * The component for catching errors and displaying error information.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = {
    error: undefined,
  };

  componentDidCatch(error: Error) {
    const { piral, errorType } = this.props;
    const pilet = piral.meta.name;
    console.error(`[${pilet}] Exception in component of type "${errorType}".`, error);

    this.setState({
      error,
    });
  }

  componentDidUpdate(_: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    const { error } = this.state;

    if (error && !prevState.error) {
      const { piral, errorType } = this.props;
      const pilet = piral.meta.name;

      defer(() => {
        piral.emit('unhandled-error', {
          errorType,
          error,
          pilet,
        });
      });
    }
  }

  render() {
    const { children, piral, errorType, ...renderProps } = this.props;
    const { error } = this.state;
    const rest: any = renderProps;

    if (error) {
      const pilet = piral.meta.name;
      return <RegisteredErrorInfo type={errorType} error={error} pilet={pilet} {...rest} />;
    }

    return <React.Suspense fallback={<RegisteredLoadingIndicator />}>{children}</React.Suspense>;
  }
}
