import * as React from 'react';

export type HighlightType = 'new' | 'updated';

export interface HighlightProps {
  highlight?: HighlightType;
}

export interface QuestionProps extends HighlightProps {
  title: string;
}

const Highlight: React.FC<HighlightProps> = ({ highlight }) => {
  switch (highlight) {
    case 'new':
      return <span className="badge badge-success">New</span>;
    case 'updated':
      return <span className="badge badge-warning">Updated</span>;
  }

  // tslint:disable-next-line
  return null;
};

export const Question: React.FC<QuestionProps> = ({ title, children, highlight }) => (
  <div className="section-block">
    <h3 className="question">
      <i className="fas fa-question-circle" /> {title} <Highlight highlight={highlight} />
    </h3>
    <div className="answer">{children}</div>
  </div>
);
