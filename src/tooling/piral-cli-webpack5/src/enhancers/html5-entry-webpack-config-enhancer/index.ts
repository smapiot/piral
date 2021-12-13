import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import { load } from 'cheerio';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { getTemplates, extractParts, setEntries } from './helpers';

export interface Html5EntryWebpackPluginOptions extends Omit<HtmlWebpackPlugin.Options, 'templateContent'> {}

export const html5EntryWebpackConfigEnhancer =
  (options: Html5EntryWebpackPluginOptions) => (compilerOptions: Configuration) => {
    const entry = compilerOptions.entry;
    const [template] = getTemplates(entry);

    if (template) {
      const src = dirname(template);
      const html = readFileSync(template, 'utf8');
      const templateContent = load(
        // try to replace ejs tags, if any
        html.replace(/<%=([\w\W]*?)%>/g, function (match, group) {
          try {
            return eval(group);
          } catch {
            return match;
          }
        }),
      );
      const entries = extractParts(templateContent).map((entry) => join(src, entry));
      const plugins = [
        new HtmlWebpackPlugin({
          ...options,
          templateContent: templateContent.html(),
        }),
      ];

      if (!entries.length) throw new Error('Template entries expected to be not empty');

      setEntries(compilerOptions, template, entries as [string, ...Array<string>]);

      compilerOptions.plugins = [...compilerOptions.plugins, ...plugins];
    }

    return compilerOptions;
  };
