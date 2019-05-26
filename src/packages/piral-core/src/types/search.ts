import { ReactNode } from 'react';

export interface SearchProvider<TApi> {
  (query: string, api: TApi): Promise<Array<ReactNode | HTMLElement>>;
}

export interface SearchHandler {
  (query: string): Promise<Array<ReactNode | HTMLElement>>;
}
