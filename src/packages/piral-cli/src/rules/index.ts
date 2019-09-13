import { readdir } from 'fs';
import { RuleContext, PiralRuleContext, PiletRuleContext, Rule } from '../types';

function getRules<T extends RuleContext>(target: 'pilet' | 'piral') {
  const prefix = `${target}-`;

  return new Promise<Array<Rule<T>>>((resolve, reject) => {
    readdir(__dirname, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files.filter(name => name.startsWith(prefix)).map(name => require(`./${name}`)));
      }
    });
  });
}

export function getPiralRules() {
  return getRules<PiralRuleContext>('piral');
}

export function getPiletRules() {
  return getRules<PiletRuleContext>('pilet');
}
