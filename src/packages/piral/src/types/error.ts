import { ComponentType } from 'react';
import {
  NotFoundErrorInfoProps,
  PageErrorInfoProps,
  ExtensionErrorInfoProps,
  LoadingErrorInfoProps,
  ErrorInfoProps,
} from 'piral-core';
import {
  TileErrorInfoProps,
  MenuItemErrorInfoProps,
  ModalErrorInfoProps,
  FeedErrorInfoProps,
  FormErrorInfoProps,
} from 'piral-ext';

declare module 'piral-core/lib/types/custom' {
  interface PiralCustomComponentsState {
    NotFoundErrorInfo: ComponentType<NotFoundErrorInfoProps>;
    PageErrorInfo: ComponentType<PageErrorInfoProps>;
    TileErrorInfo: ComponentType<TileErrorInfoProps>;
    MenuErrorInfo: ComponentType<MenuItemErrorInfoProps>;
    ExtensionErrorInfo: ComponentType<ExtensionErrorInfoProps>;
    ModalErrorInfo: ComponentType<ModalErrorInfoProps>;
    LoadingErrorInfo: ComponentType<LoadingErrorInfoProps>;
    FeedErrorInfo: ComponentType<FeedErrorInfoProps>;
    FormErrorInfo: ComponentType<FormErrorInfoProps>;
    UnknownErrorInfo: ComponentType<ErrorInfoProps>;
  }
}
