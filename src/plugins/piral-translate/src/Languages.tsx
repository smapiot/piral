import * as React from 'react';
import { useGlobalState } from 'piral-core';
import { PiralLanguagesPicker } from './components';

export const Languages: React.FC = () => {
  const { available, selected } = useGlobalState((m) => m.language);
  return <PiralLanguagesPicker selected={selected} available={available} />;
};
