import * as React from 'react';
import { ColorKind, TiComment } from './types';

export interface DetailsProps {
  title: string;
  kind: string;
  description: TiComment;
  color?: ColorKind;
  id?: string;
}

export const Details: React.FC<DetailsProps> = ({ title, kind, description, children, id, color = 'primary' }) => {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <div id={id} className={`type-info type-info-${color}`}>
      <div className="type-title" onClick={toggleOpen} title="Click to toggle details">
        <b>{kind}</b>
        <h3>{title}</h3>
        {description && description.shortText && <span className="block">{description.shortText}</span>}
      </div>
      <div className={open ? 'type-details open' : 'type-details close'}>{children}</div>
    </div>
  );
};
