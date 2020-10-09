import { isWindows } from './info';

const supportsEmoji = !isWindows || process.env.TERM === 'xterm-256color';

export const liveIcon = supportsEmoji ? '🚀 ' : '>';
export const settingsIcon = supportsEmoji ? '🔧 ' : '>';
