import { caterpillerIcon, zapIcon, butterflyIcon, cliName, cliVersion } from './common';
import { runQuestionnaireFor } from './questionnaire';
import { yargs, detailed } from './external';
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
      (argv) => {
        if (command.survey) {
          argv = argv
            .boolean('y')
            .alias('y', 'defaults')
            .describe('y', 'Skips the survey by falling back to the default values.')
            .default('y', false);
        }

        if (typeof command.flags === 'function') {
          return command.flags(argv);
        }
        return argv;
      },
      (args) => {
        const runCommand = () => {
          if (command.survey) {
            const result = detailed(process.argv).argv;
            return runQuestionnaireFor(command, result);
          } else {
            return Promise.resolve(command.run(args));
          }
        };

        console.log(`${butterflyIcon} ${cliName} v${cliVersion}`);

        return runCommand().then(
          () => process.exit(0),
          (err) => {
            err && !err.logged && console.error(err.message);
            console.log(`${caterpillerIcon} Find detailed descriptions at https://docs.piral.io/code/search`);
            process.exit(1);
          },
        );
      },
    );
  }

  argv.epilog(`${zapIcon} For more information, check out the documentation at https://docs.piral.io`).help().strict()
    .argv;
}
