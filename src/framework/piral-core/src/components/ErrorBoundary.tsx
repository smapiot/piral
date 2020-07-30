import * as React from 'react';
import { isfunc } from 'piral-base';

/**
 * The options to be used for determining the boundary's behavior.
 */
export interface ErrorBoundaryOptions<T> {
  /**
   * Callback to be used in case of an emitted error.
   * @param error The error caught by the boundary.
   */
  onError(error: Error): void;
  /**
   * Callback to be used when an error should be rendered.
   * @param error The error caught by the boundary.
   * @param props The props used by the boundary.
   */
  renderError?(error: Error, props: T): React.ReactNode;
  /**
   * Callback to used when no error should be rendered.
   * @param children The standard children to render.
   * @param props The props used by the boundary.
   */
  renderChild(children: React.ReactNode, props: T): React.ReactNode;
}

/**
 * The props of the ErrorBoundary component.
 */
export interface ErrorBoundaryProps<T> extends ErrorBoundaryOptions<T> {
  /**
   * The render props for the specific ErrorBoundary.
   */
  renderProps: T;
}

/**
 * The state of the ErrorBoundary component.
 */
export interface ErrorBoundaryState {
  /**
   * The current error (if any) caught by the boundary.
   */
  error?: Error;
}

/**
 * The React component for catching errors and displaying error information.
 */
export class ErrorBoundary<T> extends React.Component<ErrorBoundaryProps<T>, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps<T>) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: Error) {
    const { onError } = this.props;

    if (isfunc(onError)) {
      onError(error);
    }

    this.setState({
      error,
    });
  }

  render() {
    const { children, renderError, renderChild, renderProps } = this.props;
    const { error } = this.state;

    if (error) {
      if (isfunc(renderError)) {
        return renderError(error, renderProps);
      }

      return <div style={{ whiteSpace: 'pre-wrap' }}>{error && error.message}</div>;
    }

    return isfunc(renderChild) ? renderChild(children, renderProps) : children;
  }
}
