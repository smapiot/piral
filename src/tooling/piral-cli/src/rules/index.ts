import { readdir } from 'fs';
import { log } from '../common';
import { RuleContext, PiralRuleContext, PiletRuleContext, Rule } from '../types';

const piralRules: Array<Rule<PiralRuleContext>> = [];
const piletRules: Array<Rule<PiletRuleContext>> = [];

function getRules<T extends RuleContext>(target: 'pilet' | 'piral') {
  const prefix = `${target}-`;

  return new Promise<Array<Rule<T>>>((resolve, reject) => {
    readdir(__dirname, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          files
            .filter((name) => name.startsWith(prefix) && name.endsWith('.js'))
            .map((fileName) => {
              log('generalDebug_0003', `Including module "${fileName}" ...`);
              const run = require(`./${fileName}`).default;
              const name = fileName.substring(prefix.length).replace(/\.js$/, '');
              log('generalDebug_0003', `Included rule with name: "${name}".`);
              return {
                run,
                name,
              };
            }),
        );
      }
    });
  });
}

export function addPiralRule(rule: Rule<PiralRuleContext>) {
  piralRules.push(rule);
}

export async function getPiralRules() {
  log('generalDebug_0003', 'Getting Piral validation rules ...');
  const rules = await getRules<PiralRuleContext>('piral');
  log('generalDebug_0003', `Found ${rules.length} rules.`);
  return [...rules, ...piralRules];
}

export function addPiletRule(rule: Rule<PiletRuleContext>) {
  piletRules.push(rule);
}

export async function getPiletRules() {
  log('generalDebug_0003', 'Getting pilet validation rules ...');
  const rules = await getRules<PiletRuleContext>('pilet');
  log('generalDebug_0003', `Found ${rules.length} rules.`);
  return [...rules, ...piletRules];
}
