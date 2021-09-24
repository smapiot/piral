/**
 * Uses the `fetch` function (must be available). If you
 * use this function make sure to use, e.g., `whatwg-fetch`
 * which comes with polyfills for older browsers.
 * @param url The URL to GET.
 * @returns A promise leading to the raw text content.
 */
export function fetchDependency(url: string) {
  return fetch(url, {
    method: 'GET',
    cache: 'force-cache',
  }).then((m) => m.text());
}
