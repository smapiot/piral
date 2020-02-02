import * as React from 'react';
import { isfunc } from 'piral-base';

export interface ErrorBoundaryOptions<T> {
  onError(error: Error): void;
  renderError?(error: Error, props: T): React.ReactNode;
  renderChild(children: React.ReactNode, props: T): React.ReactNode;
}

export interface ErrorBoundaryProps<T> extends ErrorBoundaryOptions<T> {
  renderProps: T;
}

export interface ErrorBoundaryState {
  error?: Error;
}

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
