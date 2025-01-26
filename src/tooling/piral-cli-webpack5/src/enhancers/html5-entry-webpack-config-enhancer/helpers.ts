import type { CheerioAPI } from 'cheerio';
import type { Configuration, Entry } from 'webpack';

export function isLocal(path: string) {
  if (path) {
    if (path.startsWith(':')) {
      return false;
    } else if (path.startsWith('http:')) {
      return false;
    } else if (path.startsWith('https:')) {
      return false;
    } else if (path.startsWith('data:')) {
      return false;
    }

    return true;
  }

  return false;
}

export function extractParts(content: CheerioAPI) {
  const sheets = content('link[href][rel=stylesheet]')
    .filter((_, e) => isLocal(e.attribs.href))
    .remove()
    .toArray();
  const scripts = content('script[src]')
    .filter((_, e) => isLocal(e.attribs.src))
    .remove()
    .toArray();
  const files: Array<string> = [];

  for (const sheet of sheets) {
    files.push(sheet.attribs.href);
  }

  for (const script of scripts) {
    files.push(script.attribs.src);
  }

  return files;
}

export function getTemplates(entry: Entry): Array<string> {
  if (typeof entry === 'string') {
    return getTemplates([entry]);
  } else if (Array.isArray(entry)) {
    return entry.filter((e) => e.endsWith('.html'));
  } else if (typeof entry !== 'function') {
    return Object.values(entry).flatMap((value) => getTemplates(value as Entry));
  }

  return [];
}

export function replaceEntries(existingEntries: Array<string>, oldEntry: string, newEntries: Array<string>) {
  for (let i = 0; i < existingEntries.length; i++) {
    if (existingEntries[i] === oldEntry) {
      existingEntries.splice(i, 1, ...newEntries);
      break;
    }
  }
}

export function setEntries(config: Configuration, template: string, entries: [string, ...Array<string>]) {
  if (typeof config.entry === 'string') {
    config.entry = entries;
  } else if (Array.isArray(config.entry)) {
    replaceEntries(config.entry, template, entries);
  } else if (typeof config.entry !== 'function') {
    Object.keys(config.entry).forEach((key) => {
      const value = config.entry[key];

      if (value === template) {
        config.entry[key] = entries;
      } else if (Array.isArray(value)) {
        replaceEntries(value, template, entries);
      }
    });
  }
}
