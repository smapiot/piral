export function createExtension(selector: string) {
  const defaultExtensionSelector = 'piral-extension';

  if ('customElements' in window && selector && selector !== defaultExtensionSelector) {
    const ExtensionBase = customElements.get(defaultExtensionSelector);
    class AliasExtension extends ExtensionBase {}
    customElements.define(selector, AliasExtension);
  }

  return selector || defaultExtensionSelector;
}
