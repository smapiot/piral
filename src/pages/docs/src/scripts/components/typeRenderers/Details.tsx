import * as React from 'react';
import { ColorKind } from '../utils';

export interface DetailsProps {
  title: React.ReactChild;
  details: React.ReactChild;
  color?: ColorKind;
  id?: string;
}

export const Details: React.SFC<DetailsProps> = ({ title, details, id, color = 'primary' }) => {
  const [open, setOpen] = React.useState(false);
  const toggleOpen = () => setOpen(!open);

  return (
    <div id={id} className={`type-info type-info-${color}`}>
      <div className="type-title" onClick={toggleOpen} title="Click to toggle details">
        {title}
      </div>
      <div className={open ? 'type-details open' : 'type-details close'}>{details}</div>
    </div>
  );
};
