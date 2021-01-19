import * as React from 'react';
import { useActions, useGlobalState } from 'piral-core';
import { PiralUpdateDialog } from './components';

export const UpdateDialog: React.FC = () => {
  const actions = useActions();
  const { active, target } = useGlobalState((m) => m.updatability);

  return (
    <>
      {active && (
        <PiralUpdateDialog piletsToUpdate={target} onApprove={actions.approveUpdate} onReject={actions.rejectUpdate} />
      )}
    </>
  );
};
