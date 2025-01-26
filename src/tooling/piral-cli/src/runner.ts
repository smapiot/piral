import { start } from './start';

interface RunnerArgs {
  type: string;
  select: string;
  args: Array<string>;
}

process.on('message', async ({ type, select, args }: RunnerArgs) => {
  if (type === 'start') {
    const from = eval(select);
    process.argv.splice(2, 0, ...args);
    await start(from);
  }
});
