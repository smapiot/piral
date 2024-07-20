import { InjectionToken } from '@angular/core';
import { ComponentContext, PiletApi } from 'piral-core';

export const PROPS = new InjectionToken<any>('Props');
export const PIRAL = new InjectionToken<PiletApi>('piral');
export const CONTEXT = new InjectionToken<ComponentContext>('Context');
