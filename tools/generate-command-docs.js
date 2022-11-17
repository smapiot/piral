const { join, resolve } = require('path');
const { writeFileSync, readFileSync, readdirSync } = require('fs');

const projectRoot = resolve(__dirname, '..');
const rootFolder = resolve(projectRoot, 'docs', 'commands');
const commandFolder = resolve(projectRoot, 'src', 'tooling', 'piral-cli', 'lib', 'commands');
const validationFolder = resolve(projectRoot, 'src', 'tooling', 'piral-cli', 'src', 'rules');
const nl = '\n';

const { commands } = require(commandFolder);

function generateHead(command) {
  const parts = command.split('-');
  return `# \`${parts.pop()} ${parts.join('-')}\``;
}

function getCommandPath(command) {
  return join(rootFolder, `${command}.md`);
}

function writeCommandContent(command, content) {
  const commandMdPath = getCommandPath(command);
  writeFileSync(commandMdPath, content, 'utf8');
}

function shell(content) {
  const start = '```sh';
  const end = '```';
  return `${start}${nl}${content}${nl}${end}`;
}

function printAlias(aliases) {
  if (aliases.length === 0) {
    return 'No aliases available.';
  }

  return aliases.map((alias) => `- \`${alias}\``).join(nl);
}

function printValue(value) {
  if (value === resolve(__dirname, '..')) {
    return 'process.cwd()';
  } else {
    return JSON.stringify(value);
  }
}

function readValidatorOptions(content) {
  const head = 'export type Options = ';
  const lines = content.split('\n');
  const [line] = lines.filter((m) => m.startsWith(head));
  const value = line.substr(head.length);
  const options = value.substr(0, value.indexOf(';'));

  if (options === 'void') {
    return '<none>';
  }

  return options;
}

function readValidatorDescription(content) {
  const head = 'export default ';
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(head)) {
      const [start] = lines
        .map((m, j) => ({
          index: j,
          found: j < i && m.startsWith('/**'),
        }))
        .filter((m) => m.found)
        .map((m) => m.index)
        .reverse();
      const end = i - 1;
      return lines
        .filter((_, j) => j > start && j < end)
        .map((m) => m.substr(2))
        .join('')
        .trim();
    }
  }

  return '';
}

function readValidators() {
  const baseDir = resolve(__dirname, validationFolder);

  return readdirSync(baseDir)
    .filter(
      (file) =>
        file.endsWith('.ts') && !file.endsWith('.test.ts') && (file.startsWith('pilet-') || file.startsWith('piral-')),
    )
    .map((file) => {
      const path = resolve(baseDir, file);
      const content = readFileSync(path, 'utf8');
      return {
        target: file.split('.')[0].split('-')[0],
        name: file
          .split('.')[0]
          .split('-')
          .filter((_, i) => i > 0)
          .join('-'),
        description: readValidatorDescription(content),
        options: readValidatorOptions(content),
      };
    });
}

function getCommandData(retrieve) {
  const data = {
    positionals: [],
    flags: [],
  };
  const fn = {
    alias(name, cmd) {
      return this.swap(name, (flag) => ({
        ...flag,
        alts: [...flag.alts, cmd],
      }));
    },
    positional(name, info) {
      data.positionals.push({
        ...info,
        name,
      });
      return this;
    },
    swap(name, swapper) {
      const [flag] = data.flags.filter((m) => m.name === name);
      const newFlag = swapper(flag || { name, alts: [] });

      if (!flag) {
        data.flags.push(newFlag);
      } else {
        Object.assign(flag, newFlag);
      }

      return this;
    },
    choices(name, choices) {
      return this.swap(name, (flag) => ({
        ...flag,
        type: 'string',
        values: choices.map(printValue),
      }));
    },
    option(name) {
      return this.swap(name, (flag) => ({
        ...flag,
        type: 'options',
      }));
    },
    string(name) {
      return this.swap(name, (flag) => ({
        ...flag,
        type: 'string',
      }));
    },
    boolean(name) {
      return this.swap(name, (flag) => ({
        ...flag,
        type: 'boolean',
      }));
    },
    describe(name, value) {
      return this.swap(name, (flag) => ({
        ...flag,
        describe: value,
      }));
    },
    default(name, value) {
      return this.swap(name, (flag) => ({
        ...flag,
        default: printValue(value),
      }));
    },
    number(name) {
      return this.swap(name, (flag) => ({
        ...flag,
        type: 'number',
      }));
    },
    demandOption(name) {
      return this.swap(name, (flag) => ({
        ...flag,
        required: true,
      }));
    },
  };

  if (typeof retrieve === 'function') {
    retrieve(fn);
  }

  return data;
}

function details(args) {
  if (args.length === 0) {
    return 'Not applicable.';
  }

  return args
    .map(
      (arg) => `### \`${arg.name}\`

${arg.describe || 'No description available.'}

${!arg.alts || arg.alts.length === 0 ? '' : `- Aliases: \`${arg.alts.map((m) => `--${m}`).join('`, `')}\``}
- Type: \`${arg.type}\`${arg.values ? nl + `- Choices: \`${arg.values.join('`, `')}\`` : ''}
- Default: \`${arg.default}\`${arg.required ? nl + '- **Caution: This flag is required!**' : ''}`,
    )
    .join(nl + nl);
}

function generateValidator(validator) {
  return `### \`${validator.name}\`

${validator.description}

**Options**: \`${validator.options}\`
`;
}

function generateBody(command, validators) {
  const { positionals, flags } = getCommandData(command.flags);

  for (let i = 0; i < flags.length; i++) {
    const flag = flags[i];
    if (flag.type === 'boolean' && !flag.name.startsWith('no-')) {
      flags.splice(i + 1, 0, {
        ...flag,
        name: `no-${flag.name}`,
        describe: `Opposite of:\n${flag.describe}`,
        default: printValue(!JSON.parse(flag.default)),
      });
    }
  }

  const parts = command.name.split('-');
  const content = `
${command.description || 'No description available.'}

## Syntax

From the command line:

${shell(`${parts.pop()} ${parts.join('-')} ${command.arguments.join(' ')}`)}

Alternative:

${shell(`pb ${command.name} ${command.arguments.join(' ')}`)}

## Aliases

Instead of \`${command.name}\` you can also use:

${printAlias(command.alias)}

## Positionals

${details(positionals)}

## Flags

${details(flags.map((flag) => ({ ...flag, name: `--${flag.name}` })))}
`;

  if (['validate-piral', 'validate-pilet'].includes(command.name)) {
    const [target] = command.name.split('-').reverse();
    const currentValidators = validators.filter((m) => m.target === target);
    return `${content}
## Validators

${currentValidators.map(generateValidator).join('\n')}
`;
  }

  return content;
}

function generateContent(content, body) {
  return content + nl + body;
}

function generateCommandDocs() {
  const validators = readValidators();

  for (const command of commands.all) {
    const head = generateHead(command.name);
    const body = generateBody(command, validators);
    const content = generateContent(head, body);
    writeCommandContent(command.name, content);
  }
}

if (require.main === module) {
  generateCommandDocs();
  console.log('CLI commands documentation generated!');
} else {
  module.exports = generateCommandDocs;
}
