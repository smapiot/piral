import axios from 'axios';
import { Agent } from 'https';
import { openBrowserAt } from './browser';
import { standardHeaders } from './common';
import { logSuspend, logInfo } from './log';

type TokenResult = Promise<{ mode: string; token: string }>;

const tokenRetrievers: Record<string, TokenResult> = {};

export function getTokenInteractively(url: string, httpsAgent: Agent): TokenResult {
  if (!(url in tokenRetrievers)) {
    const logResume = logSuspend();

    tokenRetrievers[url] = axios
      .post(
        url,
        {
          clientId: 'publish-microfrontend',
          clientName: 'Publish Micro Frontend CLI',
          description: 'Authorize the Publish Micro Frontend CLI temporarily to perform actions in your name.',
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
            const { data, status } = await axios.get(callbackUrl);

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
