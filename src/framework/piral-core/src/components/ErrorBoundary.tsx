import * as React from 'react';
import { PiralError, PiralLoadingIndicator } from './components';
import { Errors, PiletApi } from '../types';

export interface ErrorBoundaryProps {
  /**
   * The type of error to indicate when caught.
   */
  errorType: keyof Errors;
  /**
   * The associated pilet api for the metadata.
   */
  piral: PiletApi;
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

  render() {
    const { children, piral, errorType, ...renderProps } = this.props;
    const { error } = this.state;
    const rest: any = renderProps;

    if (error) {
      const pilet = piral.meta.name;
      return <PiralError type={errorType} error={error} pilet={pilet} {...rest} />;
    }

    return <React.Suspense fallback={<PiralLoadingIndicator />}>{children}</React.Suspense>;
  }
}
