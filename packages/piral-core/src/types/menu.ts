export interface MenuSettings {
  /**
   * Sets the type of the menu to attach to.
   * @default "general"
   */
  type?: MenuType;
}

export type MenuType = 'general' | 'admin' | 'user' | 'header' | 'footer';
