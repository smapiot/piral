import { SvelteModule } from './lib/types';

declare module '*.svelte' {
  const mod: SvelteModule<any>;
  export default mod;
}

export * from './lib/types';
