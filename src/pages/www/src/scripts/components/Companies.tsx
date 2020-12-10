import * as React from 'react';

interface CompanyProps {
  image: string;
  title: string;
}

const Company: React.FC<CompanyProps> = ({ image, title }) => (
  <div style={{}}>
    <img src={image} alt={title} title={title} />
  </div>
);

export const Companies: React.FC = () => (
  <div className="container container-section">
    <h2>Who's Using Piral</h2>
    <p>
      We're happy to have some great innovative companies on board. Together with us they are investing in development
      of microfrontends to ensure scalability of their applications.
    </p>
    <div className="row companies">
      <Company image={require('../../assets/c_an.png')} title="Axinom" />
      <Company image={require('../../assets/c_at.png')} title="Apptio" />
      <Company image={require('../../assets/c_cc.png')} title="CHC" />
      <Company image={require('../../assets/c_hg.png')} title="Hoffmann Group" />
      <Company image={require('../../assets/c_lw.png')} title="Lilwonders" />
      <Company image={require('../../assets/c_pw.png')} title="proWIN" />
      <Company image={require('../../assets/c_rb.png')} title="Reed Business" />
      <Company image={require('../../assets/c_sm.png')} title="smapiot" />
      <Company image={require('../../assets/c_sp.png')} title="SalesPad" />
      <Company image={require('../../assets/c_zg.png')} title="ZEISS Group" />
    </div>
  </div>
);
