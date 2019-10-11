import { ComponentType } from 'react';
import {
  LoadingErrorInfoProps,
  NotFoundErrorInfoProps,
  PageErrorInfoProps,
  ErrorInfoProps,
  ExtensionErrorInfoProps,
} from 'piral-core';
import {
  FeedErrorInfoProps,
  FormErrorInfoProps,
  TileErrorInfoProps,
  ModalErrorInfoProps,
  MenuItemErrorInfoProps,
} from 'piral-ext';
import { createBuilder } from './createBuilder';
import { createErrorInfo } from '../../components';
import { ErrorBuilder } from '../../types';

export interface ErrorBuilderState {
  feed: ComponentType<FeedErrorInfoProps>;
  form: ComponentType<FormErrorInfoProps>;
  loading: ComponentType<LoadingErrorInfoProps>;
  notFound: ComponentType<NotFoundErrorInfoProps>;
  tile: ComponentType<TileErrorInfoProps>;
  modal: ComponentType<ModalErrorInfoProps>;
  extension: ComponentType<ExtensionErrorInfoProps>;
  menu: ComponentType<MenuItemErrorInfoProps>;
  page: ComponentType<PageErrorInfoProps>;
  unknown: ComponentType<ErrorInfoProps>;
}

function createInitialState(): ErrorBuilderState {
  return {
    feed: undefined,
    form: undefined,
    loading: undefined,
    notFound: undefined,
    tile: undefined,
    modal: undefined,
    extension: undefined,
    menu: undefined,
    page: undefined,
    unknown: undefined,
  };
}

export function errorBuilder(state = createInitialState()): ErrorBuilder {
  const initial = {
    build() {
      return createErrorInfo({
        FeedErrorInfo: state.feed,
        FormErrorInfo: state.form,
        LoadingErrorInfo: state.loading,
        NotFoundErrorInfo: state.notFound,
        TileErrorInfo: state.tile,
        ExtensionErrorInfo: state.extension,
        ModalErrorInfo: state.modal,
        MenuErrorInfo: state.menu,
        PageErrorInfo: state.page,
        UnknownErrorInfo: state.unknown,
      });
    },
  } as ErrorBuilder;
  return createBuilder(initial, state, errorBuilder);
}
