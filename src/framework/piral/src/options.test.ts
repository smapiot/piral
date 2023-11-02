/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { getContainer } from './options';

describe('Piral options module', () => {
  it('getContainer with a string interprets it as a selector', () => {
    document.body.innerHTML = '<span id="app"></span>';
    const element = document.querySelector('#app');
    const app = getContainer('#app');
    expect(app).toBe(element);
  });

  it('getContainer without argument appends a new element', () => {
    document.body.innerHTML = '<span id="app"></span>';
    const element = document.querySelector('div');
    const app = getContainer();
    expect(element).toBeFalsy();
    expect(app).toBe(document.querySelector('div'));
  });

  it('getContainer with an element returns the element', () => {
    document.body.innerHTML = '<span id="app"></span>';
    const element = document.querySelector('#app');
    const app = getContainer(element);
    expect(app).toBe(element);
  });
});
