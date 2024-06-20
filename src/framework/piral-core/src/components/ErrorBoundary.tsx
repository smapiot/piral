import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { RegisteredErrorInfo, RegisteredLoadingIndicator } from './components';
import { defer, generateId } from '../utils';
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

  render() {
    const { children, piral, errorType, ...renderProps } = this.props;
    const { error } = this.state;
    const rest: any = renderProps;

    if (error) {
      const errorId = `eid-${generateId()}`;
      const pilet = piral.meta.name;

      defer(() => {
        const container = findDOMNode(this);
        piral.emit('unhandled-error', {
          container,
          errorId,
          errorType,
          error,
          pilet,
        });
      });

      return <RegisteredErrorInfo type={errorType} error={error} pilet={pilet} errorId={errorId} {...rest} />;
    }

    return <React.Suspense fallback={<RegisteredLoadingIndicator />}>{children}</React.Suspense>;
  }
}
