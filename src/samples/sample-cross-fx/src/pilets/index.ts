import { ReactPilet } from './reactPilet';
import { VuePilet } from './vuePilet';
import { NgPilet } from './ngPilet';
import { NgjsPilet } from './ngjsPilet';
import { LitElPilet } from './litelPilet';
import { HyperappPilet } from './hyperappPilet';
import { InfernoPilet } from './infernoPilet';
import { PreactPilet } from './preactPilet';

/**
 * Normally all these pilets would come from some API and
 * would look quite different (i.e., not already evaluated etc.).
 *
 * This is only a very simple - for demo-purposes - kind a way.
 * The real development would also have each pilet in its own
 * repository (or at least in its own folder / structure in a
 * monorepo).
 */
export const availablePilets = [
  ReactPilet,
  VuePilet,
  NgPilet,
  HyperappPilet,
  InfernoPilet,
  PreactPilet,
  NgjsPilet,
  LitElPilet,
];
