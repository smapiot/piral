function findClosestAncestor(element: Element | null, tagName: string) {
  // tslint:disable-next-line:no-null-keyword
  return !element ? null : element.tagName === tagName ? element : findClosestAncestor(element.parentElement, tagName);
}

function getAnchorTarget(event: MouseEvent) {
  return findClosestAncestor(event.target as Element | null, 'A') as HTMLAnchorElement | null;
}

function isWithinBaseUriSpace(href: string) {
  const baseURI = document.baseURI;
  const baseUriUntilLastSlash = baseURI.substr(0, baseURI.lastIndexOf('/') + 1);
  return href.startsWith(baseUriUntilLastSlash);
}

function eventHasSpecialKey(event: MouseEvent) {
  return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;
}

export function isInternalNavigation(event: MouseEvent) {
  if (event.type === 'click' && event.button === 0 && !event.defaultPrevented) {
    const anchorTarget = getAnchorTarget(event);
    return (
      anchorTarget &&
      !eventHasSpecialKey(event) &&
      anchorTarget.hasAttribute('href') &&
      !anchorTarget.hasAttribute('download') &&
      (!anchorTarget.target || anchorTarget.target === '_self') &&
      isWithinBaseUriSpace(anchorTarget.href)
    );
  }

  return false;
}

export function performInternalNavigation(event: MouseEvent) {
  const anchorTarget = getAnchorTarget(event);
  event.preventDefault();
  const baseURI = document.baseURI;
  const baseUriUntilLastSlash = baseURI.substr(0, baseURI.lastIndexOf('/') + 1);
  const to = anchorTarget.getAttribute('href');
  const path = to.startsWith(baseUriUntilLastSlash) ? to.substring(baseUriUntilLastSlash.length) : to;
  window.Blazor.emitNavigateEvent(anchorTarget, path);
}
