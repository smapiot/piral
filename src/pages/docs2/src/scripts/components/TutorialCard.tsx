import * as React from 'react';
import { Link } from 'react-router-dom';

export interface TutorialCardProps {
  title: string;
  description: string;
  level: string;
  audience: string;
  link: string;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ title, description, level, audience, link }) => (
  <div className="tutorial">
    <div>{title}</div>
    <div>{description}</div>
    <div>{level}</div>
    <div>{audience}</div>
    <div>
      <Link to={`/tutorials/${link}`}>Link</Link>
    </div>
  </div>
);
