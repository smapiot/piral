import * as yargs from 'yargs';
import { ToolCommand } from './types';

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
            err && !err.logged && console.error(err.message);
            console.log('Codes Reference: https://docs.piral.io/code/search');
            process.exit(1);
          },
        ),
    );
  }

  argv
    .epilog('For more information, check out the documentation at https://docs.piral.io.')
    .help()
    .strict().argv;
}
