import * as React from 'react';

interface CompanyProps {
  image: string;
  title: string;
}

const Company: React.SFC<CompanyProps> = ({ image, title }) => (
  <div className="col-sm-4 col-md-2 py-2 align-self-center">
    <img src={image} alt={title} className="mx-auto d-block" />
  </div>
);

export const Companies: React.SFC = () => (
  <div className="jumbotron jumbotron-fluid">
    <div className="container">
      <div className="row">
        <Company image={require('../../assets/Company-2.png')} title="Sample Company" />
        <Company image={require('../../assets/Company-1.png')} title="Sample Company" />
        <Company image={require('../../assets/Company-3.png')} title="Sample Company" />
      </div>
    </div>
  </div>
);
