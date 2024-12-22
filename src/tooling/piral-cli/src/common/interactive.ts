import { Agent } from 'https';
import { openBrowserAt } from './browser';
import { standardHeaders } from './info';
import { logSuspend, logInfo } from './log';
import { axios, inquirer } from '../external';
import { PublishScheme } from '../types';

export function promptSelect(message: string, values: Array<string>, defaultValue: string): Promise<string> {
  const questions = [
    {
      name: 'q',
      type: 'list' as const,
      choices: values,
      message,
      default: defaultValue,
    },
  ];
  return inquirer.prompt(questions).then((answers: any) => answers.q);
}

export function promptConfirm(message: string, defaultValue: boolean): Promise<boolean> {
  const questions = [
    {
      name: 'q',
      type: 'confirm' as const,
      message,
      default: defaultValue,
    },
  ];
  return inquirer.prompt(questions).then((answers: any) => answers.q);
}

type TokenResult = Promise<{ mode: PublishScheme; token: string }>;

const tokenRetrievers: Record<string, TokenResult> = {};

export function getTokenInteractively(url: string, httpsAgent: Agent): TokenResult {
  if (!(url in tokenRetrievers)) {
    const logResume = logSuspend();

    tokenRetrievers[url] = axios
      .post(
        url,
        {
          clientId: 'piral-cli',
          clientName: 'Piral CLI',
          description: 'Authorize the Piral CLI temporarily to perform actions in your name.',
        },
        {
          headers: {
            ...standardHeaders,
            'content-type': 'application/json',
          },
          httpsAgent,
        },
      )
      .then(async (res) => {
        const { loginUrl, callbackUrl, expires } = res.data;
        const now = new Date();
        const then = new Date(expires);
        const diff = ~~((then.valueOf() - now.valueOf()) / (60 * 1000));

        logInfo(`Use the URL below to complete the login. The link expires in ${diff} minutes (${then}).`);
        logInfo('===');
        logInfo(loginUrl);
        logInfo('===');

        openBrowserAt(loginUrl);

        try {
          while (true) {
            const { data, status } = await axios.get(callbackUrl, { httpsAgent, headers: standardHeaders });

            if (status === 202) {
              await new Promise((resolve) => setTimeout(resolve, 5000));
              continue;
            }

            if (status === 200) {
              return { ...data };
            }

            throw new Error(`Could not get status from interactive login endpoint.`);
          }
        } catch (ex) {
          throw ex;
        } finally {
          logResume();
        }
      });
  }

  return tokenRetrievers[url];
}
