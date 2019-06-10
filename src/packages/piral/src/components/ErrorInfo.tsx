import * as React from 'react';
import {
  getExtensionSlot,
  ErrorInfoProps,
  NotFoundErrorInfoProps,
  PageErrorInfoProps,
  LoadingErrorInfoProps,
  FeedErrorInfoProps,
  FormErrorInfoProps,
} from 'piral-core';
import { UnknownErrorInfoProps } from '../types';

const ExtensionSlot = getExtensionSlot('error');

export interface ErrorInfoCreator {
  NotFoundErrorInfo: React.ComponentType<NotFoundErrorInfoProps>;
  PageErrorInfo: React.ComponentType<PageErrorInfoProps>;
  LoadingErrorInfo: React.ComponentType<LoadingErrorInfoProps>;
  FeedErrorInfo?: React.ComponentType<FeedErrorInfoProps>;
  FormErrorInfo?: React.ComponentType<FormErrorInfoProps>;
  UnknownErrorInfo: React.ComponentType<UnknownErrorInfoProps>;
}

export function createErrorInfo({
  NotFoundErrorInfo,
  PageErrorInfo,
  LoadingErrorInfo,
  FeedErrorInfo,
  FormErrorInfo,
  UnknownErrorInfo,
}: ErrorInfoCreator): React.SFC<ErrorInfoProps> {
  function getErrorInfo(props: ErrorInfoProps) {
    switch (props.type) {
      case 'not_found':
        return <NotFoundErrorInfo {...props} />;
      case 'page':
        return <PageErrorInfo {...props} />;
      case 'loading':
        return <LoadingErrorInfo {...props} />;
      case 'feed':
        return <FeedErrorInfo {...props} />;
      case 'form':
        return <FormErrorInfo {...props} />;
      default:
        return <UnknownErrorInfo />;
    }
  }

  return props => (
    <>
      {getErrorInfo(props)}
      <ExtensionSlot params={props} />
    </>
  );
}
