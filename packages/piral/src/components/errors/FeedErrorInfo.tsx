import * as React from 'react';
import { FeedErrorInfoProps } from 'piral-core';
import { useTranslation } from '../../hooks';

export const FeedErrorInfo: React.SFC<FeedErrorInfoProps> = ({ error }) => {
  const { feedErrorTitle, feedErrorDescription } = useTranslation();

  return (
    <pi-error>
      <pi-title>{feedErrorTitle}</pi-title>
      <pi-description>{feedErrorDescription}</pi-description>
      <pi-details>{error}</pi-details>
    </pi-error>
  );
};
