import * as React from 'react';

export interface TimelineProps {
  items: Array<{
    icon: string;
    content: React.ReactChild;
  }>;
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => (
  <ul className="timeline">
    {items.map((item, i) => (
      <li key={i}>
        <div className="timeline-badge text-center">{item.icon}</div>
        <div className="timeline-panel">{item.content}</div>
      </li>
    ))}
  </ul>
);
