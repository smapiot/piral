import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router';
import { ErrorInfoProps, LoaderProps } from 'piral-core';
import { DashboardProps } from 'piral-ext';
import {
  dashboardBuilder,
  errorBuilder,
  menuBuilder,
  modalsBuilder,
  notificationsBuilder,
  searchBuilder,
} from './builders';
import { createAppLayout } from '../components';
import { LayoutBuilder, LayoutProps, MenuProps } from '../types';

interface LayoutBuilderState {
  Loader: ComponentType<LoaderProps>;
  Layout: ComponentType<LayoutProps>;
  Menu: ComponentType<MenuProps>;
  Modals: ComponentType;
  Notifications: ComponentType;
  Search: ComponentType;
  Dashboard: ComponentType<DashboardProps>;
  Error: ComponentType<ErrorInfoProps>;
  routes: Record<string, ComponentType<RouteComponentProps>>;
}

function layoutBuilder(state: LayoutBuilderState): LayoutBuilder {
  return {
    withLoader(Loader) {
      return layoutBuilder({ ...state, Loader });
    },
    createMenu(cb) {
      return layoutBuilder(state).withMenu(cb(menuBuilder()).build());
    },
    withMenu(Menu) {
      return layoutBuilder({ ...state, Menu });
    },
    createDashboard(cb) {
      return layoutBuilder(state).withDashboard(cb(dashboardBuilder()).build());
    },
    withDashboard(Dashboard) {
      return layoutBuilder({ ...state, Dashboard });
    },
    createError(cb) {
      return layoutBuilder(state).withError(cb(errorBuilder()).build());
    },
    withError(Error) {
      return layoutBuilder({ ...state, Error });
    },
    createModals(cb) {
      return layoutBuilder(state).withModals(cb(modalsBuilder()).build());
    },
    withModals(Modals) {
      return layoutBuilder({ ...state, Modals });
    },
    createNotifications(cb) {
      return layoutBuilder(state).withNotifications(cb(notificationsBuilder()).build());
    },
    withNotifications(Notifications) {
      return layoutBuilder({ ...state, Notifications });
    },
    createSearch(cb) {
      return layoutBuilder(state).withSearch(cb(searchBuilder()).build());
    },
    withSearch(Search) {
      return layoutBuilder({ ...state, Search });
    },
    withRoute(route, Component) {
      return layoutBuilder({ ...state, routes: { ...state.routes, [route]: Component } });
    },
    withLayout(Layout) {
      return layoutBuilder({ ...state, Layout });
    },
    build() {
      return [
        createAppLayout(state),
        {
          Dashboard: state.Dashboard,
          ErrorInfo: state.Error,
          Loader: state.Loader,
          routes: state.routes,
        },
      ];
    },
  };
}

export function buildLayout(): LayoutBuilder {
  return layoutBuilder({
    Loader: undefined,
    Layout: undefined,
    Dashboard: undefined,
    Error: undefined,
    Menu: undefined,
    Modals: undefined,
    Notifications: undefined,
    Search: undefined,
    routes: {},
  });
}
