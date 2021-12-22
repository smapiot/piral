import * as React from 'react';
import { useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();
  const submit = React.useCallback(
    (ev) => {
      const input = ev.currentTarget.querySelector('input');
      history.push(`/reference/codes/${input.value}`);
      ev.preventDefault();
    },
    [history],
  );

  return (
    <div className="overlay">
      <form className="search" onSubmit={submit}>
        <div className="search-input" onClick={(ev) => ev.stopPropagation()}>
          <input type="text" maxLength={4} pattern="[0-9]{4}" style={{ fontSize: '4em', textAlign: 'center' }} />
        </div>
        <ul className="search-results">
          <li>Enter a valid 4-digit Piral CLI code above.</li>
        </ul>
      </form>
    </div>
  );
};
