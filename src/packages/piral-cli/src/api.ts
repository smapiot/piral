import { commands } from './commands';
import { ToolCommand, ToolCommandRunner, ToolCommandWrapper } from './types';

export function withCommand<T>(command: ToolCommand<T>) {
  commands.all.push(command);
  return this;
}

export function withoutCommand(commandName: string) {
  for (let i = commands.all.length; i--; ) {
    const command = commands.all[i];

    if (command.name === commandName) {
      commands.all.splice(i, 1);
    }
  }

  return this;
}

export function wrapCommand<U>(commandName: string, wrapper: ToolCommandWrapper<U>) {
  commands.all.forEach(command => {
    if (command.name === commandName) {
      const current = command.run;
      command.run = args => wrapper(args, current);
    }
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
