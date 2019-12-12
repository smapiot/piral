import 'aurelia-templating-binding';
import 'aurelia-templating-resources';
import 'aurelia-event-aggregator';
import 'aurelia-history-browser';
import { Loader } from 'aurelia-framework';

export class DefaultLoader extends Loader {
  private mapping: Record<string, string> = {};

  /**
   * Maps a module id to a source.
   * @param id The module id.
   * @param source The source to map the module to.
   */
  map(id, source) {
    this.mapping[id] = source;
  }

  /**
   * Normalizes a module id.
   * @param moduleId The module id to normalize.
   * @param relativeTo What the module id should be normalized relative to.
   * @return The normalized module id.
   */
  normalizeSync(moduleId, _relativeTo) {
    return moduleId;
  }

  /**
   * Normalizes a module id.
   * @param moduleId The module id to normalize.
   * @param relativeTo What the module id should be normalized relative to.
   * @return A promise for the normalized module id.
   */
  normalize(moduleId, relativeTo) {
    return Promise.resolve(this.normalizeSync(moduleId, relativeTo));
  }

  /**
   * Loads a module.
   * @param id The module id to normalize.
   * @return A Promise for the loaded module.
   */
  loadModule(id) {
    return Promise.resolve(require(id));
  }

  /**
   * Loads a collection of modules.
   * @param ids The set of module ids to load.
   * @return A Promise for an array of loaded modules.
   */
  loadAllModules(ids) {
    return Promise.all(ids.map(id => this.loadModule(id)));
  }

  /**
   * Loads a template.
   * @param url The url of the template to load.
   * @return A Promise for a TemplateRegistryEntry containing the template.
   */
  loadTemplate(url) {
    return fetch(url).then(res => res.json());
  }

  /**
   * Loads a text-based resource.
   * @param url The url of the text file to load.
   * @return A Promise for text content.
   */
  loadText(url) {
    return fetch(url).then(res => res.text());
  }

  /**
   * Alters a module id so that it includes a plugin loader.
   * @param url The url of the module to load.
   * @param pluginName The plugin to apply to the module id.
   * @return The plugin-based module id.
   */
  applyPluginToUrl(url, pluginName) {
    return `${url}?plugin=${pluginName}`;
  }

  /**
   * Registers a plugin with the loader.
   * @param pluginName The name of the plugin.
   * @param implementation The plugin implementation.
   */
  addPlugin(_pluginName, _implementation) {}
}
