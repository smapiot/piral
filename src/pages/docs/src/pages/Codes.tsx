import * as React from 'react';
import { useHistory } from 'react-router-dom';

const List = require('../codegen/codes-list.codegen');

const CodeInput: React.FC = () => {
  const history = useHistory();
  const [open, setOpen] = React.useState(history.location.pathname !== '/reference/codes');

  React.useEffect(() => {
    if (open) {
      document.querySelector<HTMLInputElement>('input[type=text]').focus();
    }
  }, [open]);

  return (
    <div>
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <form
            className="search"
            onSubmit={ev => {
              const input = ev.currentTarget.querySelector('input');
              history.push(`/reference/codes/${input.value}`);
              ev.preventDefault();
            }}>
            <div className="search-input" onClick={ev => ev.stopPropagation()}>
              <input type="text" maxLength={4} pattern="[0-9]{4}" style={{ fontSize: '4em', textAlign: 'center' }} />
            </div>
            <ul className="search-results">
              <li>Enter a valid 4-digit Piral CLI code above.</li>
            </ul>
          </form>
        </div>
      )}
    </div>
  );
};

export default () => (
  <section className="container">
    <h1>Message Codes</h1>
    <p>These codes are used in the Piral CLI to explain available warnings, errors, and more in depth.</p>
    <CodeInput />
    <List />
  </section>
);
