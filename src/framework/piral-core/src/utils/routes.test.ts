import { describe, it, expect } from 'vitest';
import { createRouteMatcher } from './routes';

describe('Routes Utilities', () => {
  it('creates an exact matcher that does not match', () => {
    const matcher = createRouteMatcher('/foo');
    expect(matcher.test('/bar')).toBeFalsy();
  });

  it('creates an exact matcher that does match exactly', () => {
    const matcher = createRouteMatcher('/foo');
    expect(matcher.test('/foo')).toBeTruthy();
  });

  it('creates an exact matcher that does match with trailing slash', () => {
    const matcher = createRouteMatcher('/foo');
    expect(matcher.test('/foo/')).toBeTruthy();
  });

  it('creates an exact parameter matcher that does not match', () => {
    const matcher = createRouteMatcher('/foo/:id');
    expect(matcher.test('/bar')).toBeFalsy();
  });

  it('creates an exact matcher that does not match exactly', () => {
    const matcher = createRouteMatcher('/foo/:id');
    expect(matcher.test('/foo')).toBeFalsy();
  });

  it('creates an exact matcher that does match exactly', () => {
    const matcher = createRouteMatcher('/foo/:id');
    expect(matcher.test('/foo/bar')).toBeTruthy();
  });

  it('creates an inexact matcher that does not match', () => {
    const matcher = createRouteMatcher('/foo/*');
    expect(matcher.test('/bar')).toBeFalsy();
  });

  it('creates an inexact matcher that does not match exactly', () => {
    const matcher = createRouteMatcher('/foo/:id/*');
    expect(matcher.test('/foo/')).toBeFalsy();
  });

  it('creates an inexact matcher that does match exactly', () => {
    const matcher = createRouteMatcher('/foo/*');
    expect(matcher.test('/foo/bar')).toBeTruthy();
  });
});
