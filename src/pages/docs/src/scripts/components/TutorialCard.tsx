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
  <Link to={`/tutorials/${link}`} className="tutorial-card">
    <h3>{title}</h3>
    <p className="audience info">
      <i className="fas fa-users" /> {audience} &middot; <i className="fas fa-book-open" /> {level}
    </p>
    <p>{description}</p>
  </Link>
);
