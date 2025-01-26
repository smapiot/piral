import { Flag, runQuestionnaire } from 'piral-cli';
import { postData } from 'piral-cli/utils';

const key = 'use-feed';
const options = {
  empty: 'use default empty feed',
  custom: 'use custom feed specified by URL',
  createOfficial: 'create a new feed on feed.piral.cloud',
  createCustom: 'create a new feed on a custom service',
};
const host = {
  current: 'https://feed.piral.cloud',
};

const flags: Array<Flag> = [
  {
    name: key,
    alias: [],
    default: options.empty,
    ignore: true,
    describe: 'Sets the micro frontend feed to use for the new app.',
    required: false,
    type: 'string',
    values: [options.empty, options.custom, options.createOfficial, options.createCustom],
  },
  {
    name: 'vars',
    alias: [],
    default: 'https://feed.piral.cloud/api/v1/pilet/empty',
    describe: 'The URL for the custom feed to use.',
    required: false,
    type: 'string',
    convert(answer) {
      return {
        feedUrl: answer,
      };
    },
    when(answers) {
      return answers[key] === options.custom;
    },
  },
  {
    name: 'vars',
    alias: [],
    default: `awesome-feed-${~~(Math.random() * 100000)}`,
    describe: 'The name for the custom feed to use.',
    required: false,
    type: 'string',
    async validate(answer) {
      const data = {
        id: answer,
      };
      const result = await postData(
        `https://feed.piral.cloud/api/v1/feed`,
        'none',
        '',
        data,
        { 'content-type': 'application/json' },
        undefined,
        false,
        true,
      );
      return result.success;
    },
    convert(answer) {
      return {
        feedUrl: `https://feed.piral.cloud/api/v1/pilet/${answer}`,
      };
    },
    when(answers) {
      return answers[key] === options.createOfficial;
    },
  },
  {
    name: 'custom-host',
    alias: [],
    default: host.current,
    describe: 'The host for the custom feed service to use (e.g., https://feed.company.com).',
    required: false,
    ignore: true,
    type: 'string',
    validate(answer) {
      host.current = answer;
      return /^https?:\/\//.test(answer);
    },
    when(answers) {
      return answers[key] === options.createCustom;
    },
  },
  {
    name: 'vars',
    alias: [],
    default: `awesome-feed-${~~(Math.random() * 100000)}`,
    describe: 'The name for the custom feed to use.',
    required: false,
    type: 'string',
    async validate(answer) {
      const data = {
        id: answer,
      };
      const result = await postData(
        `${host.current}/api/v1/feed`,
        'none',
        '',
        data,
        { 'content-type': 'application/json' },
        undefined,
        true,
      );
      return result.success;
    },
    convert(answer) {
      return {
        feedUrl: `${host.current}/api/v1/pilet/${answer}`,
      };
    },
    when(answers) {
      return answers[key] === options.createCustom;
    },
  },
];

runQuestionnaire('new-piral', undefined, flags).then(
  () => process.exit(0),
  (err) => {
    err && !err.logged && console.error(err.message);
    console.log('Codes Reference: https://docs.piral.io/code/search');
    process.exit(1);
  },
);
