const supportsEmoji = process.platform !== 'win32' || process.env.TERM === 'xterm-256color';

export const liveIcon = supportsEmoji ? '⚡️' : '>';
export const settingsIcon = supportsEmoji ? '⚙️' : '>';
