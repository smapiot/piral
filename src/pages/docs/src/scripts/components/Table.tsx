import * as React from 'react';
import { cn } from './utils';

export interface TableProps {
  striped?: boolean;
  bordered?: boolean;
  indexed?: boolean;
  data: {
    head?: Array<React.ReactChild>;
    body?: Array<Array<React.ReactChild>>;
  };
}

export const Table: React.FC<TableProps> = ({ indexed, bordered, striped, data: { head, body } }) => (
  <div className="table-responsive">
    <table className={cn('table', striped && 'table-striped', bordered && 'table-bordered')}>
      {head && (
        <thead>
          <tr>
            {indexed && <th>#</th>}
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
      )}
      {body && (
        <tbody>
          {body.map((row, i) => (
            <tr key={i}>
              {indexed && <th scope="row">{i + 1}</th>}
              {row.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  </div>
);
