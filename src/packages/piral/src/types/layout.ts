import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router';
import {
  ErrorInfoProps,
  DashboardProps,
  LoaderProps,
  NotFoundErrorInfoProps,
  PageErrorInfoProps,
  TileErrorInfoProps,
  MenuItemErrorInfoProps,
  LoadingErrorInfoProps,
  FeedErrorInfoProps,
  FormErrorInfoProps,
  OpenModalDialog,
  OpenNotification,
  GlobalStateOptions,
} from 'piral-core';
import {
  MenuProps,
  LayoutProps,
  UnknownErrorInfoProps,
  MenuContainerProps,
  MenuItemProps,
  ModalsContainerProps,
  NotificationsContainerProps,
  SearchContainerProps,
  SearchInputProps,
  SearchResultProps,
  TileProps,
  DashboardContainerProps,
} from './components';

export interface DashboardBuilder {
  container(Component: ComponentType<DashboardContainerProps>): DashboardBuilder;
  tile(Component: ComponentType<TileProps>): DashboardBuilder;
  build(): ComponentType<DashboardProps>;
}

export interface ErrorBuilder {
  notFound(Component: ComponentType<NotFoundErrorInfoProps>): ErrorBuilder;
  page(Component: ComponentType<PageErrorInfoProps>): ErrorBuilder;
  tile(Component: ComponentType<TileErrorInfoProps>): ErrorBuilder;
  menu(Component: ComponentType<MenuItemErrorInfoProps>): ErrorBuilder;
  loading(Component: ComponentType<LoadingErrorInfoProps>): ErrorBuilder;
  feed(Component: ComponentType<FeedErrorInfoProps>): ErrorBuilder;
  form(Component: ComponentType<FormErrorInfoProps>): ErrorBuilder;
  unknown(Component: ComponentType<UnknownErrorInfoProps>): ErrorBuilder;
  build(): ComponentType<ErrorInfoProps>;
}

export interface MenuBuilder {
  container(Component: ComponentType<MenuContainerProps>): MenuBuilder;
  item(Component: ComponentType<MenuItemProps>): MenuBuilder;
  build(): ComponentType<MenuProps>;
}

export interface ModalsBuilder {
  container(Component: ComponentType<ModalsContainerProps>): ModalsBuilder;
  dialog(Component: ComponentType<OpenModalDialog>): ModalsBuilder;
  build(): ComponentType;
}

export interface NotificationsBuilder {
  container(Component: ComponentType<NotificationsContainerProps>): NotificationsBuilder;
  item(Component: ComponentType<OpenNotification>): NotificationsBuilder;
  build(): ComponentType;
}

export interface SearchBuilder {
  container(Component: ComponentType<SearchContainerProps>): SearchBuilder;
  input(Component: ComponentType<SearchInputProps>): SearchBuilder;
  result(Component: ComponentType<SearchResultProps>): SearchBuilder;
  build(): ComponentType;
}

export interface CallbackBuilder<T> {
  (builder: T): T;
}

export interface LayoutBuilder {
  withLoader(Component: ComponentType<LoaderProps>): LayoutBuilder;
  createMenu(builder: CallbackBuilder<MenuBuilder>): LayoutBuilder;
  withMenu(Component: ComponentType<MenuProps>): LayoutBuilder;
  createModals(builder: CallbackBuilder<ModalsBuilder>): LayoutBuilder;
  withModals(Component: ComponentType): LayoutBuilder;
  createNotifications(builder: CallbackBuilder<NotificationsBuilder>): LayoutBuilder;
  withNotifications(Component: ComponentType): LayoutBuilder;
  createDashboard(builder: CallbackBuilder<DashboardBuilder>): LayoutBuilder;
  withDashboard(Component: ComponentType<DashboardProps>): LayoutBuilder;
  createError(builder: CallbackBuilder<ErrorBuilder>): LayoutBuilder;
  withError(Component: ComponentType<ErrorInfoProps>): LayoutBuilder;
  createSearch(builder: CallbackBuilder<SearchBuilder>): LayoutBuilder;
  withSearch(Component: ComponentType): LayoutBuilder;
  withRoute(route: string, Component: ComponentType<RouteComponentProps>): LayoutBuilder;
  withTracker(Component: ComponentType<RouteComponentProps>): LayoutBuilder;
  withLayout(Component: ComponentType<LayoutProps>): LayoutBuilder;
  build(): [ComponentType, GlobalStateOptions];
}
