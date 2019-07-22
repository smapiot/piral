import { ComponentType } from 'react';
import {
  FeedErrorInfoProps,
  FormErrorInfoProps,
  LoadingErrorInfoProps,
  NotFoundErrorInfoProps,
  PageErrorInfoProps,
  ErrorInfoProps,
} from 'piral-core';
import { createErrorInfo } from '../../components';
import { ErrorBuilder } from '../../types';

export interface ErrorBuilderState {
  feed: ComponentType<FeedErrorInfoProps>;
  form: ComponentType<FormErrorInfoProps>;
  loading: ComponentType<LoadingErrorInfoProps>;
  notFound: ComponentType<NotFoundErrorInfoProps>;
  page: ComponentType<PageErrorInfoProps>;
  unknown: ComponentType<ErrorInfoProps>;
}

function createInitialState(): ErrorBuilderState {
  return {
    feed: undefined,
    form: undefined,
    loading: undefined,
    notFound: undefined,
    page: undefined,
    unknown: undefined,
  };
}

export function errorBuilder(state = createInitialState()): ErrorBuilder {
  return {
    feed(Component) {
      return errorBuilder({
        ...state,
        feed: Component,
      });
    },
    form(Component) {
      return errorBuilder({
        ...state,
        form: Component,
      });
    },
    loading(Component) {
      return errorBuilder({
        ...state,
        loading: Component,
      });
    },
    notFound(Component) {
      return errorBuilder({
        ...state,
        notFound: Component,
      });
    },
    page(Component) {
      return errorBuilder({
        ...state,
        page: Component,
      });
    },
    unknown(Component) {
      return errorBuilder({
        ...state,
        unknown: Component,
      });
    },
    build() {
      return createErrorInfo({
        FeedErrorInfo: state.feed,
        FormErrorInfo: state.form,
        LoadingErrorInfo: state.loading,
        NotFoundErrorInfo: state.notFound,
        PageErrorInfo: state.page,
        UnknownErrorInfo: state.unknown,
      });
    },
  };
}
