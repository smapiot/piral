import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export interface SectionItem {
  title: string;
  links: Array<{
    id: string;
    title?: string;
    link?: string;
    route: string;
  }>;
}

export interface SectionMenuProps {
  sections: Array<SectionItem>;
}

export const SectionMenu: React.FC<SectionMenuProps> = ({ sections }) => {
  const container = React.useRef<HTMLDivElement>(undefined);

  React.useEffect(() => container.current?.scrollTo(0, 0), [sections]);

  return (
    <Sidebar className="section-nav" ref={container}>
      {sections.map((section) => (
        <React.Fragment key={section.title}>
          <div className="section-nav-title">{section.title}</div>
          <ul className="section-nav-list">
            {section.links.map((link) => (
              <li key={link.id}>
                <NavLink to={link.link || link.route}>{link.title || link.id}</NavLink>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </Sidebar>
  );
};
