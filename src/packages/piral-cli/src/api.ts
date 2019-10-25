import { logWarn } from './common';
import { commands } from './commands';
import { addPiletRule, addPiralRule } from './rules';
import {
  ToolCommand,
  ToolCommandRunner,
  ToolCommandWrapper,
  ToolCommandFlagsSetter,
  RuleRunner,
  PiralRuleContext,
  PiletRuleContext,
} from './types';

function findAll(commandName: string, cb: (command: ToolCommand<any, any>, index: number) => void) {
  for (let i = commands.all.length; i--; ) {
    const command = commands.all[i];

    if (command.name === commandName) {
      cb(command, i);
    }
  }
}

export function withCommand<T, U>(command: ToolCommand<T, U>) {
  commands.all.push(command);
  return this;
}

export function withoutCommand(commandName: string) {
  findAll(commandName, (_, i) => commands.all.splice(i, 1));
  return this;
}

export function withFlags<T>(commandName: string, setter: ToolCommandFlagsSetter<T>) {
  if (typeof commandName !== 'string') {
    logWarn('Invalid argument for "commandName" - no flags added.');
  } else if (typeof setter !== 'function') {
    logWarn('Invalid argument for "setter" - no flags added.');
  } else {
    findAll(commandName, command => {
      const current = command.flags || (x => x);
      command.flags = argv => current(setter(argv));
    });
  }

  return this;
}

export function wrapCommand<U>(commandName: string, wrapper: ToolCommandWrapper<U>) {
  if (typeof commandName !== 'string') {
    logWarn('Invalid argument for "commandName" - no command wrapped.');
  } else if (typeof wrapper !== 'function') {
    logWarn('Invalid argument for "wrapper" - no command wrapped.');
  } else {
    findAll(commandName, command => {
      const current = command.run;
      command.run = args => wrapper(args, current);
    });
  }

  return this;
}

export function beforeCommand<U>(commandName: string, before: ToolCommandRunner<U>) {
  if (typeof commandName !== 'string') {
    logWarn('Invalid argument for "commandName" - no before command added.');
  } else if (typeof before !== 'function') {
    logWarn('Invalid argument for "before" - no before command added.');
  } else {
    wrapCommand<U>(commandName, async (args, current) => {
      await before(args);
      await current(args);
    });
  }

  return this;
}

export function afterCommand<U>(commandName: string, after: ToolCommandRunner<U>) {
  if (typeof commandName !== 'string') {
    logWarn('Invalid argument for "commandName" - no after command added.');
  } else if (typeof after !== 'function') {
    logWarn('Invalid argument for "after" - no after command added.');
  } else {
    wrapCommand<U>(commandName, async (args, current) => {
      await current(args);
      await after(args);
    });
  }

  return this;
}

export function withPiralRule(name: string, run: RuleRunner<PiralRuleContext>) {
  if (typeof name !== 'string') {
    logWarn('Invalid argument for "name" - no Piral rule added.');
  } else if (typeof run !== 'function') {
    logWarn('Invalid argument for "run" - no Piral rule added.');
  } else {
    addPiralRule({ name, run });
  }

  return this;
}

export function withPiletRule(name: string, run: RuleRunner<PiletRuleContext>) {
  if (typeof name !== 'string') {
    logWarn('Invalid argument for "name" - no pilet rule added.');
  } else if (typeof run !== 'function') {
    logWarn('Invalid argument for "run" - no pilet rule added.');
  } else {
    addPiletRule({ name, run });
  }

  return this;
}
