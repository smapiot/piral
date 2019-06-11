import { ComponentType } from 'react';
import {
  MenuType,
  LoaderProps,
  NotFoundErrorInfoProps,
  PageErrorInfoProps,
  LoadingErrorInfoProps,
  FeedErrorInfoProps,
  FormErrorInfoProps,
  OpenNotification,
  OpenModalDialog,
} from 'piral-core';

export interface MenuProps {
  type?: MenuType;
}

export interface DashboardContainerProps {}

export interface TileProps {
  columns: number;
  rows: number;
  resizable: boolean;
}

export type UnknownErrorInfoProps = any;

export interface MenuContainerProps {
  type: MenuType;
}

export interface MenuItemProps {
  type: MenuType;
}

export interface SearchContainerProps {
  input: React.ReactChild;
  loading: boolean;
}

export interface SearchInputProps {
  setValue(value: string): void;
  value: string;
}

export interface SearchResultProps {}

export interface NotificationsContainerProps {}

export interface ModalsContainerProps {}

export interface LayoutProps {
  Menu: ComponentType<MenuProps>;
  Search: ComponentType;
  Modals: ComponentType;
  Notifications: ComponentType;
}

export interface ComponentOptions {
  Loader?: ComponentType<LoaderProps>;
  FeedErrorInfo?: ComponentType<FeedErrorInfoProps>;
  FormErrorInfo?: ComponentType<FormErrorInfoProps>;
  LoadingErrorInfo?: ComponentType<LoadingErrorInfoProps>;
  NotFoundErrorInfo?: ComponentType<NotFoundErrorInfoProps>;
  PageErrorInfo?: ComponentType<PageErrorInfoProps>;
  UnknownErrorInfo: ComponentType<UnknownErrorInfoProps>;
  DashboardContainer: ComponentType<DashboardContainerProps>;
  Tile: ComponentType<TileProps>;
  MenuContainer: ComponentType<MenuContainerProps>;
  MenuItem: ComponentType<MenuItemProps>;
  SearchContainer: ComponentType<SearchContainerProps>;
  SearchInput: ComponentType<SearchInputProps>;
  SearchResult: ComponentType<SearchResultProps>;
  NotificationsContainer: ComponentType<NotificationsContainerProps>;
  NotificationItem: ComponentType<OpenNotification>;
  ModalsContainer: ComponentType<ModalsContainerProps>;
  ModalDialog: ComponentType<OpenModalDialog>;
  Layout: ComponentType<LayoutProps>;
}
