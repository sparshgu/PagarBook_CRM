import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import '../AdminDashboard.css';

export default function AdminNotInterested() {
  const { leads, reassignLead } = useData();
  const { allStaff } = useAuth();
  const [reassignTarget, setReassignTarget] = useState({});

  const notInterested = leads.filter(l => l.status === 'not_interested');

  const handleReassign = (leadId) => {
    const target = reassignTarget[leadId];
    if (!target) return;
    reassignLead(leadId, target);
  };

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">❌ Not Interested Leads</h1>
          <p className="section-subtitle">
            Ye leads wapas kisi RE ko assign kar sakte ho — {notInterested.length} total
          </p>
        </div>
      </div>

      <div className="card">
        {notInterested.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', padding: 40, textAlign: 'center' }}>
            Koi not interested lead nahi hai. 🎉
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Owner</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Assigned To</th>
                  <th style={thStyle}>Notes</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Reassign To</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {notInterested.map((lead, i) => {
                  const currentStaff = allStaff.find(s => s.id === lead.assignedTo);
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...tdStyle, color: 'var(--text-dim)', fontFamily: 'monospace' }}>{i + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{lead.companyName}</td>
                      <td style={tdStyle}>{lead.ownerName}</td>
                      <td style={{ ...tdStyle, fontFamily: 'monospace', color: 'var(--text-muted)' }}>{lead.phone}</td>
                      <td style={{ ...tdStyle, color: 'var(--primary)' }}>{currentStaff?.name || lead.assignedTo}</td>
                      <td style={{ ...tdStyle, color: 'var(--text-muted)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lead.notes || '—'}
                      </td>
                      <td style={tdStyle}><StatusBadge status={lead.status} /></td>
                      <td style={tdStyle}>
                        <select
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1.5px solid var(--border)',
                            borderRadius: 6,
                            padding: '7px 10px',
                            color: 'var(--text)',
                            fontSize: 13,
                            outline: 'none',
                          }}
                          value={reassignTarget[lead.id] || ''}
                          onChange={e => setReassignTarget(prev => ({ ...prev, [lead.id]: e.target.value }))}
                        >
                          <option value="">-- Select RE --</option>
                          {allStaff.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleReassign(lead.id)}
                          disabled={!reassignTarget[lead.id]}
                          style={{
                            background: reassignTarget[lead.id] ? 'rgba(255,107,43,0.18)' : 'rgba(255,255,255,0.04)',
                            border: '1px solid',
                            borderColor: reassignTarget[lead.id] ? 'rgba(255,107,43,0.4)' : 'transparent',
                            borderRadius: 6,
                            color: reassignTarget[lead.id] ? 'var(--primary)' : 'var(--text-dim)',
                            padding: '7px 14px',
                            fontSize: 12.5,
                            fontWeight: 600,
                            cursor: reassignTarget[lead.id] ? 'pointer' : 'not-allowed',
                            transition: 'all 0.15s',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          🔄 Reassign
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '11px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' };
const tdStyle = { padding: '11px 14px', color: 'var(--text)', verticalAlign: 'middle' };
