import * as React from 'react';

export function defaultRender(children: React.ReactNode, key?: string) {
  return <React.Fragment key={key}>{children}</React.Fragment>;
}
