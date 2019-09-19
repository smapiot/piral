import * as React from 'react';
import { getExtensionSlot } from '../extension';
import { ErrorInfoProps } from '../../types';

const ExtensionSlot = getExtensionSlot('error');

export const DefaultErrorInfo: React.FC<ErrorInfoProps<any>> = props => (
  <ExtensionSlot
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
      }
    }}
  />
);
DefaultErrorInfo.displayName = 'DefaultErrorInfo';

export default DefaultErrorInfo;
