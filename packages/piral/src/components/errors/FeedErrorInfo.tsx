import * as React from 'react';
import { FeedErrorInfoProps } from 'piral-core';
import { useTranslation } from '../hooks';

export const FeedErrorInfo: React.SFC<FeedErrorInfoProps> = props => {
  const { feedErrorTitle, feedErrorDescription } = useTranslation();

  return (
    <pi-error>
      <pi-title>{feedErrorTitle}</pi-title>
      <pi-description>{feedErrorDescription}</pi-description>
    </pi-error>
  );
};
