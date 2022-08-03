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
  <div className="container container-section text-center">
    <h2>Who's Using Piral</h2>
    <p className="larger">
      We're happy to have some great innovative companies and institutions on board. Together with us they are investing
      in development of micro frontends to ensure scalability of their applications.
    </p>
    <div className="row companies">
      <Company image={require('../../assets/c_an.png')} title="Axinom" />
      <Company image={require('../../assets/c_at.png')} title="Apptio" />
      <Company image={require('../../assets/c_cc.png')} title="CHC" />
      <Company image={require('../../assets/c_gs.png')} title="GoSecure" />
      <Company image={require('../../assets/c_hg.png')} title="Hoffmann Group" />
      <Company image={require('../../assets/c_ic.png')} title="inContact" />
      <Company image={require('../../assets/c_nd.png')} title="Nando's" />
      <Company image={require('../../assets/c_lw.png')} title="Lilwonders" />
      <Company image={require('../../assets/c_pw.png')} title="proWIN" />
      <Company image={require('../../assets/c_rb.png')} title="Reed Business" />
      <Company image={require('../../assets/c_sm.png')} title="smapiot" />
      <Company image={require('../../assets/c_sp.png')} title="SalesPad" />
      <Company image={require('../../assets/c_ww.png')} title="Wiener Wohnen" />
      <Company image={require('../../assets/c_zg.png')} title="ZEISS Group" />
      <Company image={require('../../assets/c_hbhc.png')} title="homecare homebase" />
      <Company image={require('../../assets/c_ch.png')} title="Casablanca Hotelsoftware" />
      <Company image={require('../../assets/c_co.png')} title="Consolinno Energy" />
      <Company image={require('../../assets/c_ua.png')} title="Universidad de Alcalá" />
    </div>
    <p className="faded">
      Just contact us if you are using Piral and want to include your logo in the list above. If you want your logo
      removed you can also contact us any time.
    </p>
  </div>
);
