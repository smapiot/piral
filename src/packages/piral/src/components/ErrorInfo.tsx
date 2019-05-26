import * as React from 'react';
import { getExtensionSlot, ErrorInfoProps } from 'piral-core';
import {
  NotFoundErrorInfo,
  PageErrorInfo,
  LoadingErrorInfo,
  FeedErrorInfo,
  FormErrorInfo,
  UnknownErrorInfo,
} from './errors';

const ExtensionSlot = getExtensionSlot('error');

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

export const ErrorInfo: React.SFC<ErrorInfoProps> = props => {
  return (
    <>
      {getErrorInfo(props)}
      <ExtensionSlot params={props} />
    </>
  );
};
