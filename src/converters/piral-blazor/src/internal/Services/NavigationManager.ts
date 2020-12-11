import { EventDelegator } from '../Rendering/EventDelegator';

// tslint:disable:no-string-literal
// tslint:disable:no-null-keyword

let hasEnabledNavigationInterception = true;
let hasRegisteredNavigationEventListeners = false;

// Will be initialized once someone registers
let notifyLocationChangedCallback: ((uri: string, intercepted: boolean) => Promise<void>) | null = null;

// These are the functions we're making available for invocation from .NET
export const navigationManager = {
  listenForNavigationEvents,
  enableNavigationInterception,
  disableNavigationInterception,
  navigateTo,
  getBaseURI: () => document.baseURI,
  getLocationHref: () => location.href,
};

function listenForNavigationEvents(callback: (uri: string, intercepted: boolean) => Promise<void>) {
  notifyLocationChangedCallback = callback;

  if (hasRegisteredNavigationEventListeners) {
    return;
  }

  hasRegisteredNavigationEventListeners = true;
  window.addEventListener('popstate', () => notifyLocationChanged(false));
}

function disableNavigationInterception() {
  hasEnabledNavigationInterception = false;
}

function enableNavigationInterception() {
  hasEnabledNavigationInterception = true;
}

export function attachToEventDelegator(eventDelegator: EventDelegator) {
  // We need to respond to clicks on <a> elements *after* the EventDelegator has finished
  // running its simulated bubbling process so that we can respect any preventDefault requests.
  // So instead of registering our own native event, register using the EventDelegator.
  eventDelegator.notifyAfterClick((event) => {
    if (!hasEnabledNavigationInterception || !(event.target instanceof HTMLElement)) {
      return;
    }

    const anc = event.target.closest('[data-blazor-pilet-root], [data-portal-id]');

    if (!(anc instanceof HTMLElement) || !anc.dataset.blazorPiletRoot) {
      return;
    }

    if (event.button !== 0 || eventHasSpecialKey(event)) {
      // Don't stop ctrl/meta-click (etc) from opening links in new tabs/windows
      return;
    }

    if (event.defaultPrevented) {
      return;
    }

    // Intercept clicks on all <a> elements where the href is within the <base href> URI space
    // We must explicitly check if it has an 'href' attribute, because if it doesn't, the result might be null or an empty string depending on the browser
    const anchorTarget = findClosestAncestor(event.target as Element | null, 'A') as HTMLAnchorElement | null;
    const hrefAttributeName = 'href';

    if (anchorTarget && anchorTarget.hasAttribute(hrefAttributeName)) {
      const targetAttributeValue = anchorTarget.getAttribute('target');
      const opensInSameFrame = !targetAttributeValue || targetAttributeValue === '_self';

      if (!opensInSameFrame) {
        return;
      }

      const href = anchorTarget.getAttribute(hrefAttributeName)!;
      const absoluteHref = toAbsoluteUri(href);

      if (isWithinBaseUriSpace(absoluteHref)) {
        event.preventDefault();
        performInternalNavigation(anchorTarget, absoluteHref, true);
      }
    }
  });
}

export function navigateTo(uri: string, forceLoad: boolean, replace: boolean = false) {
  const absoluteUri = toAbsoluteUri(uri);

  if (!forceLoad && isWithinBaseUriSpace(absoluteUri)) {
    // It's an internal URL, so do client-side navigation
    performInternalNavigation(document.body, absoluteUri, false, replace);
  } else if (forceLoad && location.href === uri) {
    // Force-loading the same URL you're already on requires special handling to avoid
    // triggering browser-specific behavior issues.
    // For details about what this fixes and why, see https://github.com/dotnet/aspnetcore/pull/10839
    const temporaryUri = uri + '?';
    history.replaceState(null, '', temporaryUri);
    location.replace(uri);
  } else if (replace) {
    history.replaceState(null, '', absoluteUri);
  } else {
    // It's either an external URL, or forceLoad is requested, so do a full page load
    location.href = uri;
  }
}

function performInternalNavigation(
  target: HTMLElement,
  absoluteInternalHref: string,
  interceptedLink: boolean,
  replace: boolean = false,
) {
  const path = getRelativeUri(absoluteInternalHref);
  window['Blazor'].emitNavigateEvent(target, path, replace);
  notifyLocationChanged(interceptedLink);
}

async function notifyLocationChanged(interceptedLink: boolean) {
  if (notifyLocationChangedCallback) {
    await notifyLocationChangedCallback(location.href, interceptedLink);
  }
}

let testAnchor: HTMLAnchorElement;
export function toAbsoluteUri(relativeUri: string) {
  testAnchor = testAnchor || document.createElement('a');
  testAnchor.href = relativeUri;
  return testAnchor.href;
}

function findClosestAncestor(element: Element | null, tagName: string) {
  return !element ? null : element.tagName === tagName ? element : findClosestAncestor(element.parentElement, tagName);
}

function getBaseUri() {
  // TODO: Might baseURI really be null?
  return toBaseUriWithTrailingSlash(document.baseURI);
}

function getRelativeUri(href: string) {
  return href.substr(getBaseUri().length);
}

function isWithinBaseUriSpace(href: string) {
  return href.startsWith(getBaseUri());
}

function toBaseUriWithTrailingSlash(baseUri: string) {
  return baseUri.substr(0, baseUri.lastIndexOf('/') + 1);
}

function eventHasSpecialKey(event: MouseEvent) {
  return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}
