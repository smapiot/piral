import { commands } from './commands';
import { ToolCommand, ToolCommandRunner, ToolCommandWrapper, ToolCommandFlagsSetter } from './types';

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
  findAll(commandName, command => {
    const current = command.flags || (x => x);
    command.flags = argv => current(setter(argv));
  });
  return this;
}

export function wrapCommand<U>(commandName: string, wrapper: ToolCommandWrapper<U>) {
  findAll(commandName, command => {
    const current = command.run;
    command.run = args => wrapper(args, current);
  });
  return this;
}

export function beforeCommand<U>(commandName: string, before: ToolCommandRunner<U>) {
  wrapCommand<U>(commandName, async (args, current) => {
    await before(args);
    await current(args);
  });
  return this;
}

export function afterCommand<U>(commandName: string, after: ToolCommandRunner<U>) {
  wrapCommand<U>(commandName, async (args, current) => {
    await current(args);
    await after(args);
  });
  return this;
}
