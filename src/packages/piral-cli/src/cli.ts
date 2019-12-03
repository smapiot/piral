import * as yargs from 'yargs';
import { ToolCommand } from './types';
import { logFail } from './common';

let argv = yargs;

function buildCommand<T>(command: ToolCommand<T>) {
  if (command.arguments.length > 0) {
    return `${command.name} ${command.arguments.join(' ')}`;
  }

  return command.name;
}

export function setupCli(commands: Array<ToolCommand<any>>) {
  for (const command of commands) {
    argv = argv.command(
      [buildCommand(command), ...command.alias],
      command.description,
      argv => {
        if (typeof command.flags === 'function') {
          return command.flags(argv);
        }
        return argv;
      },
      args =>
        Promise.resolve(command.run(args)).then(
          () => process.exit(0),
          err => {
            err && logFail(err.message);
            process.exit(1);
          },
        ),
    );
  }

  argv
    .epilog('For more information, check out the documentation at https://piral.io.')
    .help()
    .strict().argv;
}
