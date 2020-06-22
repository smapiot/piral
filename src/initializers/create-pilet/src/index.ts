import { runQuestionnaire } from 'piral-cli';

runQuestionnaire('new-pilet').then(
  () => process.exit(0),
  err => {
    err && !err.logged && console.error(err.message);
    console.log('Codes Reference: https://docs.piral.io/code/search');
    process.exit(1);
  },
);
