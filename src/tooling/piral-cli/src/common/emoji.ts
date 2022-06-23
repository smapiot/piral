import { isWindows } from './info';

const supportsEmoji = !isWindows || process.env.TERM === 'xterm-256color';

export const liveIcon = supportsEmoji ? '🚀 ' : '>';
export const settingsIcon = supportsEmoji ? '🔧 ' : '>';
// see https://unicode.org/emoji/charts/full-emoji-list.html
export const cactusIcon = supportsEmoji ? '👻' : '';
export const clapIcon = supportsEmoji ? '👏' : '';
export const sparklesIcon = supportsEmoji ? '✨' : '';
export const unicornIcon = supportsEmoji ? '🦄' : '';
export const caterpillerIcon = supportsEmoji ? '🐛' : '';
export const butterflyIcon = supportsEmoji ? '🦋' : '';
export const zapIcon = supportsEmoji ? '⚡' : '';
export const rainbowIcon = supportsEmoji ? '🌈' : '';
