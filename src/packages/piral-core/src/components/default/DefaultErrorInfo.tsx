import * as React from 'react';
import { ExtensionSlot } from '../extension';
import { ErrorInfoProps } from '../../types';

export const DefaultErrorInfo: React.FC<ErrorInfoProps> = props => (
  <ExtensionSlot
    name="error"
    params={props}
    empty={() => {
      switch (props.type) {
        case 'not_found':
          return <div key="default_error">Page {props.location.pathname} not found.</div>;
        case 'page':
          return <div key="default_error">Page {props.location.pathname} crashed.</div>;
        case 'extension':
          return <div key="default_error">Extension crashed: {props.error}.</div>;
        case 'loading':
          return <div key="default_error">App could not be loaded: {props.error}.</div>;
        default:
          return <div key="default_error">The component crashed.</div>;
      }
    }}
  />
);
DefaultErrorInfo.displayName = 'DefaultErrorInfo';
