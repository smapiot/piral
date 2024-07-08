import * as React from 'react';
import { useActions, useGlobalState } from 'piral-core';
import { PiralUpdateDialog } from './components';

export const UpdateDialog: React.FC = () => {
  const actions = useActions();
  const { active, updated, removed } = useGlobalState((m) => m.updatability);
  const piletsToUpdate = [...updated, ...removed];

  return (
    <>
      {active && (
        <PiralUpdateDialog
          piletsToUpdate={piletsToUpdate}
          onApprove={actions.approveUpdate}
          onReject={actions.rejectUpdate}
        />
      )}
    </>
  );
};
