import { ComponentType } from 'react';
import { MenuType, LayoutType } from 'piral-core';

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

export interface ModalsContainerProps {
  open: boolean;
  close(): void;
}

export interface LayoutProps extends LayoutComponents {
  selectedLanguage: string;
  availableLanguages: Array<string>;
  currentLayout: LayoutType;
}

export interface LayoutComponents {
  Menu: ComponentType<MenuProps>;
  Search: ComponentType;
  Modals: ComponentType;
  Notifications: ComponentType;
}
