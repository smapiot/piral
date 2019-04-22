import * as React from 'react';
import {
  getExtensionSlot,
  ErrorInfoProps,
  NotFoundErrorInfoProps,
  FormErrorInfoProps,
  FeedErrorInfoProps,
  LoadingErrorInfoProps,
  PageErrorInfoProps,
} from 'piral-core';
import { useTranslation } from './hooks';

const ExtensionSlot = getExtensionSlot('error');

const NotFoundErrorInfo: React.SFC<NotFoundErrorInfoProps> = props => {
  const { notFoundErrorTitle, notFoundErrorDescription } = useTranslation();
  //props.location.pathname

  return (
    <pi-error>
      <pi-title>{notFoundErrorTitle}</pi-title>
      <pi-description>{notFoundErrorDescription}</pi-description>
    </pi-error>
  );
};

const PageErrorInfo: React.SFC<PageErrorInfoProps> = props => (
  <pi-error>Page {props.location.pathname} crashed.</pi-error>
);

const LoadingErrorInfo: React.SFC<LoadingErrorInfoProps> = props => (
  <pi-error>Page could not be loaded: {props.error}.</pi-error>
);

const FeedErrorInfo: React.SFC<FeedErrorInfoProps> = props => <pi-error>Feed error: {props.error}.</pi-error>;

const FormErrorInfo: React.SFC<FormErrorInfoProps> = props => <pi-error>Form error: {props.error}.</pi-error>;

const UnknownErrorInfo: React.SFC = () => <pi-error>An unknown error occured.</pi-error>;

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
