const { join, resolve } = require('path');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { allCommands } = require('../packages/piral-cli/lib/commands');
const nl = '\n';
const autoGenMessage = 'auto-generated';
const startMarker = `<!--start:${autoGenMessage}-->`;
const endMarker = `<!--end:${autoGenMessage}-->`;

const rootFolder = resolve(__dirname, '..', 'docs', 'commands');

function generateNewContent(command) {
  return `# \`${command}\`

${startMarker}

${endMarker}
`;
}

function getCommandPath(command) {
  return join(rootFolder, `${command}.md`);
}

function getExistingContent(command) {
  const commandMdPath = getCommandPath(command);

  if (existsSync(commandMdPath)) {
    return readFileSync(commandMdPath, 'utf8');
  }

  return generateNewContent(command);
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

  return aliases.map(alias => `- \`${alias}\``).join(nl);
}

function getCommandData(retrieve) {
  const data = {
    positionals: [],
    flags: [],
  };
  const fn = {
    positional(name, info) {
      data.positionals.push({
        ...info,
        name,
      });
      return this;
    },
    swap(name, swapper) {
      const [flag] = data.flags.filter(m => m.name === name);
      const newFlag = swapper(flag || { name });

      if (!flag) {
        data.flags.push(newFlag);
      } else {
        Object.assign(flag, newFlag);
      }

      return this;
    },
    string(name) {
      return this.swap(name, flag => ({
        ...flag,
        type: 'string',
      }));
    },
    describe(name, value) {
      return this.swap(name, flag => ({
        ...flag,
        describe: value,
      }));
    },
    default(name, value) {
      if (value === resolve(__dirname, '..')) {
        value = 'process.cwd()';
      } else {
        value = JSON.stringify(value);
      }

      return this.swap(name, flag => ({
        ...flag,
        default: value,
      }));
    },
    number(name) {
      return this.swap(name, flag => ({
        ...flag,
        type: 'number',
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

  return args.map(arg => `### \`${arg.name}\`

${arg.describe || 'No description available.'}

- Type: \`${arg.type}\`
- Default: \`${arg.default}\``).join(nl + nl);
}

function generateFrom(command) {
  const { positionals, flags } = getCommandData(command.flags);
  return `
${command.description || 'No description available.'}

## Syntax

From the command line:

${shell(`pb ${command.name} ${command.arguments.join(' ')}`)}

## Aliases

Instead of \`${command.name}\` you can also use:

${printAlias(command.alias)}

## Positionals

${details(positionals)}

## Flags

${details(flags.map(flag => ({ ...flag, name: `--${flag.name}` })))}
`;
}

function replaceBody(command, content, body) {
  const startIndex = content.indexOf(startMarker);

  if (startIndex === -1) {
    console.warn(`Could not find start marker. Please do not remove the auto generated blocks. Skipping "${command}".`);
    return content;
  }

  const endIndex = content.indexOf(endMarker, startIndex);
  const rest = endIndex !== -1 ? content.substring(endIndex) : endMarker;
  return content.substring(0, startIndex + startMarker.length) + nl + body + nl + rest;
}

function generateCommandDocs() {
  for (const command of allCommands) {
    const oldContent = getExistingContent(command.name);
    const body = generateFrom(command);
    const newContent = replaceBody(command.name, oldContent, body);
    writeCommandContent(command.name, newContent);
  }
}

if (require.main === module) {
  generateCommandDocs();
  console.log('CLI commands documentation generated!');
} else {
  module.exports = generateCommandDocs;
}
