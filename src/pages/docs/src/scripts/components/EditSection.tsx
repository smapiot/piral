import * as React from 'react';
import { docRef } from './urls';
import { Icon } from './Icon';

export interface EditSectionProps {
  link: string;
}

export const EditSection: React.FC<EditSectionProps> = ({ link }) => (
  <div className="edit-github">
    <a href={docRef(link)} target="_blank">
      <Icon content="pencil-alt" /> Edit on GitHub
    </a>
  </div>
);
