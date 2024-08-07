import { InjectionToken } from '@angular/core';
import type { ComponentContext, PiletApi } from 'piral-core';
import { contextName, piralName, propsName } from './constants';

export const PROPS = new InjectionToken<any>(propsName);
export const PIRAL = new InjectionToken<PiletApi>(piralName);
export const CONTEXT = new InjectionToken<ComponentContext>(contextName);
