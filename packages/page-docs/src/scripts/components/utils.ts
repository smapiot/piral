export function cn(...classes: Array<string>) {
  return classes.filter(m => !!m).join(' ');
}

export type ColorKind = 'primary' | 'blue' | 'green' | 'pink' | 'orange' | 'purple' | 'red';

export type IconName =
  | 'thumbs-up'
  | 'info-circle'
  | 'paper-plane'
  | 'bug'
  | 'exclamation-triangle'
  | 'exclamation-circle'
  | 'download'
  | 'code-branch'
  | 'play-circle'
  | 'cloud-download-alt'
  | 'life-ring'
  | 'gavel'
  | 'gift'
  | 'book'
  | 'puzzle-piece'
  | 'pencil-alt'
  | 'home';
