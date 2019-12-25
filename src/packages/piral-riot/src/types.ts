import { ForeignComponent, ExtensionSlotProps } from 'piral-core';
import { RiotComponentShell } from 'riot';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletRiotApi {}

  interface PiralCustomComponentConverters<TProps> {
    riot(component: RiotComponent<TProps>): ForeignComponent<TProps>;
  }
}

export interface RiotComponent<TProps> {
  /**
   * The component.
   */
  component: RiotComponentShell<TProps>;
  /**
   * The type of the Riot.js component.
   */
  type: 'riot';
}

/**
 * Defines the provided set of Riot.js Pilet API extensions.
 */
export interface PiletRiotApi {
  /**
   * Wraps an Riot.js component for use in Piral.
   * @param component The component root.
   * @returns The Piral Riot.js component.
   */
  fromRiot<TProps>(component: RiotComponentShell<TProps>): RiotComponent<TProps>;
  /**
   * Riot.js component for displaying extensions of the given name.
   */
  RiotExtension: RiotComponentShell<ExtensionSlotProps>;
}
