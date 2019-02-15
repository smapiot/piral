import * as yargs from 'yargs';
import { ToolCommand } from './commands';

let argv = yargs;

interface BaseArgs {
  base: string;
}

function buildCommand<T>(command: ToolCommand<T>) {
  if (command.arguments.length > 0) {
    return `${command.name} ${command.arguments.join(' ')}`;
  }

  return command.name;
}

export function setupCli(commands: Array<ToolCommand<any>>) {
  for (const command of commands) {
    argv = argv.command<BaseArgs>(
      [buildCommand(command), ...command.alias],
      command.description,
      argv => {
        if (typeof command.flags === 'function') {
          return command.flags(argv);
        }
        return argv;
      },
      args => {
        command.run({
          baseDir: args.base,
          ...args,
        });
      },
    );
  }

  argv
    .epilog('For more information, check out the documentation at https://piral.io.')
    .string('base')
    .default('base', process.cwd())
    .describe('base', 'Sets the base directory. By default the current directory is used.')
    .help()
    .strict().argv;
}
