import { platform } from 'os';

const os = platform();

export const standardHeaders = {
  'user-agent': `publish-microfrontend/http.node-${os}`,
};

export const isWindows = process.platform === 'win32';
