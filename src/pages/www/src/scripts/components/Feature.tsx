import * as React from 'react';

export interface FeatureProps {
  title: string;
  image: string;
  reverse?: boolean;
}

export const Feature: React.SFC<FeatureProps> = ({ title, image, children, reverse }) => {
  const dir = reverse ? 'right' : 'left';
  const pos1 = reverse ? 'first' : 'last';
  const pos2 = reverse ? 'last' : 'first';
  const box1 = (
    <div className={`col-md-6 flex-md-${pos1}`}>
      <h2 className="font-weight-bold">{title}</h2>
      {children}
    </div>
  );
  const box2 = (
    <div className={`col-md-6 align-self-center flex-md-${pos2}`}>
      <img src={image} alt={title} className="mx-auto d-block" />
    </div>
  );

  return (
    <div className="container my-5">
      <div className={`row justify-content-between text-center text-md-${dir}`}>
        {reverse ? (
          <>
            {box2}
            {box1}
          </>
        ) : (
          <>
            {box1}
            {box2}
          </>
        )}
      </div>
    </div>
  );
};
