import React from 'react';
import { useData } from '../context/DataContext';
import './StatusBadge.css';

export default function StatusBadge({ status }) {
  const { CALL_STATUSES } = useData();
  const found = CALL_STATUSES.find(s => s.value === status);
  if (!found) return <span className="status-badge" style={{ background: '#333', color: '#888' }}>Unknown</span>;
  return (
    <span
      className="status-badge"
      style={{
        background: found.color + '22',
        color: found.color,
        borderColor: found.color + '44',
      }}
    >
      {found.label}
    </span>
  );
}
