import { start } from './start';

process.on('message', async ({ type, select, args }) => {
  if (type === 'start') {
    const from = eval(select);
    process.argv.splice(2, 0, ...args);
    await start(from);
  }
});
