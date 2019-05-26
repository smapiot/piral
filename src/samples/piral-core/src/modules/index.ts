import { ConnectorModule } from './connector';
import { DashboardModule } from './dashboard';
import { Module1 } from './module1';
import { Module2 } from './module2';
import { SearchModule } from './search';
import { FormModule } from './form';

/**
 * Normally all these modules would come from some API and
 * would look quite different (i.e., not already evaluated etc.).
 *
 * This is only a very simple - for demo-purposes - kind a way.
 * The real development would also have each module in its own
 * repository (or at least in its own folder / structure in a
 * monorepo).
 */
export const modules = [DashboardModule, ConnectorModule, Module1, Module2, SearchModule, FormModule];
