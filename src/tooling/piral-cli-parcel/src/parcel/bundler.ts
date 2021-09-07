import * as Bundler from 'parcel-bundler';
import extendBundlerWithAtAlias = require('parcel-plugin-at-alias');
import extendBundlerWithCodegen = require('parcel-plugin-codegen');
import extendBundlerWithImportMaps = require('parcel-plugin-import-maps');
import { PiletSchemaVersion } from 'piral-cli';
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
  let bundler: Bundler;

  if (!original) {
    original = proto.getLoadedAsset;
  } else {
    proto.getLoadedAsset = original;
  }

  if (setup.type === 'pilet') {
    const { entryModule, targetDir, externals, config } = setup;
    bundler = new Bundler(entryModule, extendConfig(config));
    const resolver = combineExternals(targetDir, [], externals, {});
    extendBundlerWithExternals(bundler, resolver);
  } else {
    const { entryFiles, config } = setup;
    bundler = new Bundler(entryFiles, extendConfig(config));
  }

  extendBundlerWithAtAlias(bundler);
  extendBundlerWithCodegen(bundler);
  extendBundlerWithImportMaps(bundler);
  return bundler;
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
        if (childBundle.totalSize > 0) {
          source.css = childBundle.name;
        }
      }
    }

    gatheredBundles.push(source);
  }

  for (const childBundle of bundle.childBundles) {
    gatherJsBundles(childBundle, gatheredBundles, bundle);
  }

  return gatheredBundles;
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

function getScriptHead(version: PiletSchemaVersion, prName: string, dependencies: Record<string, string>): string {
  switch (version) {
    case 'none':
      return `\n${initializer}`;
    case 'v0': // directEval
      return `${piletMarker}0\n${initializer}`;
    case 'v1': // currentScript
      return `${piletMarker}1(${prName})\n${initializer}${insertScript}`;
    case 'v2': // SystemJS
      return `${piletMarker}2(${prName},${JSON.stringify(dependencies)})`;
    default:
      log('invalidSchemaVersion_0171', version, ['v0', 'v1', 'v2']);
      return getScriptHead('v0', prName, dependencies);
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

interface Importmap {
  imports: Record<string, string>;
}

export function getDependencies() {
  const packageDetails = require(resolve(process.cwd(), 'package.json'));
  const importmap: Importmap = packageDetails.importmap;
  const dependencies = {};
  const sharedImports = importmap?.imports;

  //TODO
  // if (typeof compilerOptions.entry === 'object' && compilerOptions.entry && typeof sharedImports === 'object') {
  //   for (const depName of Object.keys(sharedImports)) {
  //     const details = require(`${depName}/package.json`);
  //     const depId = `${depName}@${details.version}`;
  //     dependencies[depId] = `${depName}.js`;
  //     compilerOptions.externals[depName] = depId;
  //     compilerOptions.entry[depName] = resolve(process.cwd(), sharedImports[depName]);
  //   }
  // }

  return dependencies;
}

/**
 * Transforms a pilet's bundle to a microfrontend entry module.
 * @param bundle The bundle to transform.
 * @param version The manifest version to create.
 */
export async function postProcess(
  bundle: Bundler.ParcelBundle,
  version: PiletSchemaVersion,
  minified: boolean,
  dependencies: Record<string, string>,
) {
  const hash = bundle.getHash();
  const prName = `pr_${hash}`;
  const bundles = gatherJsBundles(bundle);

  await Promise.all(
    bundles.map(async ({ src, css, map, parent }) => {
      const root = parent === undefined;
      const head = root ? getScriptHead(version, prName, dependencies) : initializer;
      const marker = root ? piletMarker : head;
      const originalContent = await readFileContent(src);
      const refAdjustedContent = replaceAssetRefs(src, originalContent);
      const adjustedContent = includeCssLink(css, refAdjustedContent);
      const details = {
        prName,
        version,
        dependencies,
        marker,
        head,
        map,
        minified,
      };
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

function includeCssLink(css: string, content: string) {
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
    const stylesheet = [
      `var d=document`,
      `var e=d.createElement("link")`,
      `e.type="text/css"`,
      `e.rel="stylesheet"`,
      `e.href=${bundleUrlRef}+${JSON.stringify(cssName)}`,
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
  dependencies: Record<string, string>;
  marker: string;
  head: string;
}

async function wrapJsBundle(details: WrapDetails, content: string) {
  const { version, marker } = details;

  /**
   * Only happens in (pilet) debug mode:
   * Untouched bundles are not rewritten so we ignore them.
   */
  if (!content.startsWith(marker)) {
    switch (version) {
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
  const { minified, map, prName, head } = details;
  const originalRequire = minified
    ? '"function"==typeof parcelRequire&&parcelRequire'
    : "typeof parcelRequire === 'function' && parcelRequire";

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

  content = `
    System.register([], function(e,c){
      var dep;
      return {
        setters: [function(_dep){
          dep = _dep;
        }],
        execute: function(_export){
          _export((function(){
            //TODO content here
            ;global.${prName}=parcelRequire}(window, window.${prName}));
          })());
        },
      };
    });
  `;

  if (!hasSourceMaps) {
    lines.push(sourceMapping);
  }

  if (hasSourceMaps) {
    lines.push(sourceMapping);
  }

  return lines.join('\n');
}
