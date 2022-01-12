import * as Bundler from 'parcel-bundler';
import extendBundlerWithAtAlias = require('parcel-plugin-at-alias');
import extendBundlerWithCodegen = require('parcel-plugin-codegen');
import type { PiletSchemaVersion, SharedDependency } from 'piral-cli';
import { log } from 'piral-cli/utils';
import { extendBundlerWithExternals, combineExternals } from 'parcel-plugin-externals/utils';
import { SourceMapConsumer, SourceMapGenerator } from 'source-map';
import { existsSync, statSync, readFile, writeFile } from 'fs';
import { resolve, dirname, basename } from 'path';
import { extendConfig } from './settings';
import { BundlerSetup } from '../types';

let original: any;

export function setupBundler(setup: BundlerSetup) {
  const proto = Bundler.prototype as any;

  if (!original) {
    original = proto.getLoadedAsset;
  } else {
    proto.getLoadedAsset = original;
  }

  switch (setup.type) {
    case 'pilet': {
      const { entryModule, targetDir, externals, config, importmap } = setup;
      const deps = externals.concat(importmap.map((m) => m.name));
      const bundler = new Bundler(entryModule, extendConfig(config));
      const resolver = combineExternals(targetDir, [], deps, {});
      extendBundlerWithExternals(bundler, resolver);
      extendBundlerWithAtAlias(bundler);
      extendBundlerWithCodegen(bundler);
      return bundler;
    }
    case 'piral': {
      const { entryFiles, config } = setup;
      const bundler = new Bundler(entryFiles, extendConfig(config));
      extendBundlerWithAtAlias(bundler);
      extendBundlerWithCodegen(bundler);
      return bundler;
    }
    case 'dependency': {
      const { entryModule, targetDir, externals, config, importmap } = setup;
      const deps = externals.concat(importmap.map((m) => m.name));
      const bundler = new Bundler(entryModule, extendConfig(config));
      const resolver = combineExternals(targetDir, [], deps, {});
      extendBundlerWithExternals(bundler, resolver);
      extendBundlerWithCodegen(bundler);
      return bundler;
    }
  }
}

export interface BundleSource {
  parent: Bundler.ParcelBundle;
  children: Set<Bundler.ParcelBundle>;
  src: string;
  css: string;
  map: string;
}

export function gatherJsBundles(
  bundle: Bundler.ParcelBundle,
  gatheredBundles: Array<BundleSource> = [],
  parent: Bundler.ParcelBundle = undefined,
) {
  if (bundle.type === 'js') {
    const source: BundleSource = {
      parent,
      children: bundle.childBundles,
      src: bundle.name,
      css: undefined,
      map: undefined,
    };

    for (const childBundle of bundle.childBundles) {
      if (childBundle.name.endsWith('.js.map')) {
        source.map = childBundle.name;
      } else if (childBundle.name.endsWith('.css')) {
        source.css = childBundle.name;
      }
    }

    gatheredBundles.push(source);
  }

  for (const childBundle of bundle.childBundles) {
    gatherJsBundles(childBundle, gatheredBundles, bundle);
  }

  return gatheredBundles;
}

function gatherExternals(bundle: Bundler.ParcelBundle, gatheredExternals: Array<string> = []) {
  if (bundle.type === 'external') {
    const offset = 1;
    const length = '.external'.length + offset;
    const assetName = bundle.entryAsset.name;
    const name = assetName.substr(offset, assetName.length - length);
    gatheredExternals.push(name);
  }

  for (const childBundle of bundle.childBundles) {
    gatherExternals(childBundle, gatheredExternals);
  }

  return gatheredExternals;
}

const bundleUrlRef = '__bundleUrl__';
const piletMarker = '//@pilet v:';
const preamble = `!(function(global,parcelRequire){'use strict';`;
const insertScript = `function define(getExports){(typeof document!=='undefined')&&(document.currentScript.app=getExports())};define.amd=true;`;
const getBundleUrl = `function(){try{throw new Error}catch(t){const e=(""+t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\\/\\/[^)\\n]+/g);if(e)return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\\/\\/.+)\\/[^\\/]+$/,"$1")+"/"}return"/"}`;
const dynamicPublicPath = `var ${bundleUrlRef}=${getBundleUrl}();`;
const initializer = `${preamble}${dynamicPublicPath}`;

function isFile(bundleDir: string, name: string) {
  const path = resolve(bundleDir, name);
  return existsSync(path) && statSync(path).isFile();
}

function getScriptHead(version: PiletSchemaVersion, prName: string, importmap: Array<SharedDependency>): string {
  switch (version) {
    case 'none':
      return `\n${initializer}`;
    case 'v0': // directEval
      return `${piletMarker}0\n${initializer}`;
    case 'v1': // currentScript
      return `${piletMarker}1(${prName})\n${initializer}${insertScript}`;
    case 'v2': // SystemJS
      return `${piletMarker}2(${prName},${JSON.stringify(
        importmap.reduce((obj, dep) => {
          obj[dep.id] = dep.ref;
          return obj;
        }, {}),
      )})`;
    default:
      log('invalidSchemaVersion_0171', version, ['v0', 'v1', 'v2']);
      return getScriptHead('v0', prName, importmap);
  }
}

function readFileContent(src: string) {
  return new Promise<string>((resolve, reject) =>
    readFile(src, 'utf8', (err, data) => (err ? reject(err) : resolve(data))),
  );
}

function writeFileContent(src: string, content: string) {
  return new Promise<void>((resolve, reject) =>
    writeFile(src, content, 'utf8', (err) => (err ? reject(err) : resolve())),
  );
}

async function applySourceMapShift(sourceFile: string, lineOffset = 1): Promise<string> {
  const content = await readFileContent(sourceFile);
  const incomingSourceMap = JSON.parse(content);
  // we need the await, because (in contrast to the d.ts), this may return a Promise!
  const consumer = await new SourceMapConsumer(incomingSourceMap);
  const generator = new SourceMapGenerator({
    file: incomingSourceMap.file,
    sourceRoot: incomingSourceMap.sourceRoot,
  });

  consumer.eachMapping((m) => {
    // skip invalid (not-connected) mapping
    // refs: https://github.com/mozilla/source-map/blob/182f4459415de309667845af2b05716fcf9c59ad/lib/source-map-generator.js#L268-L275
    if (m.originalLine > 0 && m.originalColumn >= 0 && m.source) {
      generator.addMapping({
        source: m.source,
        name: m.name,
        original: { line: m.originalLine, column: m.originalColumn },
        generated: { line: m.generatedLine + lineOffset, column: m.generatedColumn },
      });
    }
  });

  const outgoingSourceMap = JSON.parse(generator.toString());
  outgoingSourceMap.sources = incomingSourceMap.sources;
  outgoingSourceMap.sourcesContent = incomingSourceMap.sourcesContent;
  return JSON.stringify(outgoingSourceMap);
}

/**
 * Transforms a pilet's bundle to a microfrontend entry module.
 * @param bundle The bundle to transform.
 * @param name The name of the package for the chunk.
 * @param version The manifest version to create.
 * @param minified Determines if the bundle should be minified.
 * @param importmap The importmap for sharing dependencies.
 * @param isDependency Determines if the given bundle is a pilet or dependency.
 */
export async function postProcess(
  bundle: Bundler.ParcelBundle,
  name: string,
  version: PiletSchemaVersion,
  minified: boolean,
  importmap: Array<SharedDependency>,
  isDependency = false,
) {
  const prName = `parcelChunkpr_${name.replace(/\W/gi, '')}`;
  const bundles = gatherJsBundles(bundle);
  const externals = gatherExternals(bundle);

  await Promise.all(
    bundles.map(async ({ src, css, map, parent }) => {
      const root = parent === undefined;
      const originalContent = await readFileContent(src);
      const refAdjustedContent = replaceAssetRefs(src, originalContent);
      const adjustedContent = includeCssLink(css, refAdjustedContent, name);
      const details = {
        prName,
        version,
        externals,
        importmap,
        marker: undefined,
        head: '',
        map,
        minified,
        root,
      };

      if (!isDependency) {
        details.head = root ? getScriptHead(version, prName, importmap) : initializer;
        details.marker = root ? piletMarker : details.head;
      }

      const wrappedContent = await wrapJsBundle(details, adjustedContent);
      await writeFileContent(src, wrappedContent);
    }),
  );

  return prName;
}

function replaceAssetRefs(src: string, content: string) {
  const bundleDir = dirname(src);

  return content.replace(/^module\.exports\s?=\s?"(.*)";$/gm, (str, value) => {
    if (isFile(bundleDir, value)) {
      return str.replace(`"${value}"`, `${bundleUrlRef}+"${value}"`);
    } else {
      return str;
    }
  });
}

function includeCssLink(css: string, content: string, name: string) {
  /**
   * In pure JS bundles (i.e., we are not starting with an HTML file) Parcel
   * just omits the included CSS... This is bad (to say the least).
   * Here, we search for any sibling CSS bundles (there should be at most 1)
   * and include it asap using a standard approach.
   * Note: In the future we may allow users to disable this behavior (via a Piral
   * setting to disallow CSS inject).
   */
  if (css) {
    const cssName = basename(css);
    const debug = process.env.NODE_ENV === 'development';
    const stylesheet = [
      `var d=document`,
      `var u=${bundleUrlRef}+${JSON.stringify(cssName)}`,
      `var e=d.createElement("link")`,
      `e.setAttribute('data-origin', ${JSON.stringify(name)})`,
      `e.type="text/css"`,
      `e.rel="stylesheet"`,
      `e.href=${debug ? 'u+"?_="+Math.random()' : 'u'}`,
      `d.head.appendChild(e)`,
    ].join(';');

    /**
     * Only happens in debug mode:
     * Apply this only when the stylesheet is not yet part of the file.
     * This solves the edge case of touching files (i.e., saving without any change).
     * Here, Parcel triggers a re-build, but does not change the output files.
     * Making the change here would destroy the file.
     */
    if (content.indexOf(stylesheet) === -1) {
      return `(function(){${stylesheet}})();${content}`;
    }
  }

  return content;
}

interface WrapDetails {
  map: string;
  minified: boolean;
  prName: string;
  version: PiletSchemaVersion;
  externals: Array<string>;
  importmap: Array<SharedDependency>;
  marker?: string;
  head: string;
  root: boolean;
}

async function wrapJsBundle(details: WrapDetails, content: string) {
  const { version, marker, root } = details;

  /**
   * Only happens in (pilet) debug mode:
   * Untouched bundles are not rewritten so we ignore them.
   */
  if (!content.startsWith(marker)) {
    switch (root && version) {
      case 'v2':
        return await wrapSystemJs(details, content);
      default:
        return await wrapUmd(details, content);
    }
  }

  return content;
}

/**
 * Transforms a pilet's bundle to an UMD entry module.
 */
async function wrapUmd(details: WrapDetails, content: string): Promise<string> {
  const { minified, map, prName, head } = details;
  const originalRequire = minified
    ? '"function"==typeof parcelRequire&&parcelRequire'
    : "typeof parcelRequire === 'function' && parcelRequire";

  /**
   * We perform quite some updates to the generated bundle.
   * We need to take care of aligning the .js.map file to these changes.
   */
  if (map) {
    const offset = head.split('\n').length;
    const result = await applySourceMapShift(map, offset);
    await writeFileContent(map, result);
  }

  /**
   * Wrap the JavaScript output bundle in an IIFE, fixing `global` and
   * `parcelRequire` declaration problems, and preventing `parcelRequire`
   * from leaking into global (window).
   * @see https://github.com/parcel-bundler/parcel/issues/1401
   */
  content = [head, content.split(originalRequire).join(`"function"==typeof global.${prName}&&global.${prName}`)].join(
    '\n',
  );

  const lines = content.split('\n');
  const sourceMapping = lines.pop();
  const hasSourceMaps = sourceMapping.indexOf('//# sourceMappingURL=') === 0;

  if (!hasSourceMaps) {
    lines.push(sourceMapping);
  }

  lines.push(`;global.${prName}=parcelRequire}(window, window.${prName}));`);

  if (hasSourceMaps) {
    lines.push(sourceMapping);
  }

  return lines.join('\n');
}

/**
 * Transforms a pilet's bundle to a SystemJS entry module.
 */
async function wrapSystemJs(details: WrapDetails, content: string): Promise<string> {
  const { minified, map, prName, head, importmap, externals } = details;
  const dependencies = externals.map((depName) => importmap.find((i) => i.name === depName)?.id ?? depName);
  const originalRequire = minified
    ? '"function"==typeof parcelRequire&&parcelRequire'
    : "typeof parcelRequire === 'function' && parcelRequire";

  if (map) {
    const offset = head.split('\n').length + 3;
    const result = await applySourceMapShift(map, offset);
    await writeFileContent(map, result);
  }

  const lines = content
    .split(originalRequire)
    .join(`"function"==typeof global.${prName}&&global.${prName}`)
    .split('\n');
  const sourceMapping = lines.pop();
  const hasSourceMaps = sourceMapping.indexOf('//# sourceMappingURL=') === 0;

  if (!hasSourceMaps) {
    lines.push(sourceMapping);
  }

  const innerContent = lines.join('\n');
  const modDeps = JSON.stringify(dependencies);
  const init = externals.map((e) => `${JSON.stringify(e)}:{}`).join(',');
  const check = `var e=new Error("Cannot find module '"+n+"'");e.code='MODULE_NOT_FOUND';throw e`;
  const getters = `var _deps={${init}};var require=function(n){var d=_deps[n];if(!d){${check}} return d}`;
  const setters = externals.map((d) => `function(_dep){_deps[${JSON.stringify(d)}]=_dep}`).join(',');
  const execute = `function(){var module={exports:{}};var exports=module.exports;
${initializer}${innerContent};global.${prName}=parcelRequire}(window,window.${prName}));
_export(module.exports);
}`;

  lines.splice(
    0,
    lines.length,
    `${head}
System.register(${modDeps},function(_export){${getters};return {
  setters:[${setters}],
  execute:${execute},
}});`,
  );

  if (hasSourceMaps) {
    lines.push(sourceMapping);
  }

  return lines.join('\n');
}
