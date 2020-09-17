import { log, installPatch } from './common';
import { commands } from './commands';
import { setBundler } from './bundler';
import { addPiletRule, addPiralRule } from './rules';
import {
  ToolCommand,
  ToolCommandRunner,
  ToolCommandWrapper,
  ToolCommandFlagsSetter,
  RuleRunner,
  PiralRuleContext,
  PiletRuleContext,
  PackagePatcher,
  BundlerDefinition,
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

function maybeWithFlags<T>(commandName: string, setter?: ToolCommandFlagsSetter<T>) {
  if (typeof setter === 'function') {
    withFlags(commandName, setter);
  }
}

export function withFlags<T>(commandName: string, setter: ToolCommandFlagsSetter<T>) {
  if (typeof commandName !== 'string') {
    log('apiCommandNameInvalid_0200', 'flags');
  } else if (typeof setter !== 'function') {
    log('apiArgumentInvalid_0201', 'setter', 'flags');
  } else {
    findAll(commandName, (command) => {
      const current = command.flags || ((x) => x);
      command.flags = (argv) => current(setter(argv));
    });
  }

  return this;
}

export function wrapCommand<U>(commandName: string, wrapper: ToolCommandWrapper<U>) {
  if (typeof commandName !== 'string') {
    log('apiCommandNameInvalid_0200', 'command');
  } else if (typeof wrapper !== 'function') {
    log('apiArgumentInvalid_0201', 'wrapper', 'command');
  } else {
    findAll(commandName, (command) => {
      const current = command.run;
      command.run = (args) => wrapper(args, current);
    });
  }

  return this;
}

export function beforeCommand<U>(commandName: string, before: ToolCommandRunner<U>) {
  if (typeof commandName !== 'string') {
    log('apiCommandNameInvalid_0200', 'before command');
  } else if (typeof before !== 'function') {
    log('apiArgumentInvalid_0201', 'before', 'before command');
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
    log('apiCommandNameInvalid_0200', 'after command');
  } else if (typeof after !== 'function') {
    log('apiArgumentInvalid_0201', 'after', 'after command');
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
    log('apiValidateNameInvalid_0202', 'Piral');
  } else if (typeof run !== 'function') {
    log('apiValidateRunInvalid_0203', 'Piral');
  } else {
    addPiralRule({ name, run });
  }

  return this;
}

export function withPiletRule(name: string, run: RuleRunner<PiletRuleContext>) {
  if (typeof name !== 'string') {
    log('apiValidateNameInvalid_0202', 'pilet');
  } else if (typeof run !== 'function') {
    log('apiValidateRunInvalid_0203', 'pilet');
  } else {
    addPiletRule({ name, run });
  }

  return this;
}

export function withPatcher(packageName: string, patch: PackagePatcher) {
  if (typeof packageName !== 'string') {
    log('apiPatchInvalid_0204', 'packageName');
  } else if (typeof patch !== 'function') {
    log('apiPatchInvalid_0204', 'patch');
  } else {
    installPatch(packageName, patch);
  }

  return this;
}

export function withBundler(name: string, actions: BundlerDefinition) {
  if (typeof name !== 'string') {
    log('apiBundlerInvalid_0206', 'bundlerName');
  } else if (typeof actions !== 'object') {
    log('apiBundlerInvalid_0206', 'bundler');
  } else {
    setBundler({
      name,
      actions,
    });

    maybeWithFlags('debug-piral', actions.debugPiral.flags);
    maybeWithFlags('build-piral', actions.buildPiral.flags);
    maybeWithFlags('debug-pilet', actions.debugPilet.flags);
    maybeWithFlags('build-pilet', actions.buildPilet.flags);
  }

  return this;
}
