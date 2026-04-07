import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import './UpdateLeadModal.css';

export default function UpdateLeadModal({ lead, onClose }) {
  const { updateLeadStatus, CALL_STATUSES } = useData();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || '');
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || '');
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState('dark');

  const needsFollowUp = ['follow_up', 'follow_up_demo', 'payment'].includes(status);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    updateLeadStatus(lead.id, status, notes, followUpDate);
    setSaving(false);
    onClose();
  };

  const selectedStatus = CALL_STATUSES.find(s => s.value === status);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal-card animate-in ${theme}`}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Call Update</h2>
            <p className="modal-subtitle">{lead.companyName} • {lead.ownerName}</p>
          </div>
          <div className="modal-header-actions">
            <div className="theme-switcher">
              <button
                type="button"
                className={theme === 'light' ? 'theme-btn active' : 'theme-btn'}
                onClick={() => setTheme('light')}
              >Light</button>
              <button
                type="button"
                className={theme === 'dark' ? 'theme-btn active' : 'theme-btn'}
                onClick={() => setTheme('dark')}
              >Dark</button>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal-info">
          <div className="info-pill">📱 {lead.phone}</div>
          <div className="info-pill">🏢 {lead.companyName}</div>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Call Status</label>
            <div className="status-grid">
              {CALL_STATUSES.filter(s => s.value !== 'pending').map(s => (
                <button
                  key={s.value}
                  className={`status-option ${status === s.value ? 'selected' : ''}`}
                  style={{
                    '--opt-color': s.color,
                    borderColor: status === s.value ? s.color : 'transparent',
                    background: status === s.value ? s.color + '22' : 'var(--card-surface)',
                    color: status === s.value ? s.color : 'var(--card-text-muted)',
                  }}
                  onClick={() => setStatus(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {needsFollowUp && (
            <div className="modal-field">
              <label>Follow Up Date</label>
              <input
                type="date"
                className="modal-input"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
              />
            </div>
          )}

          <div className="modal-field">
            <label>Notes / Remarks</label>
            <textarea
              className="modal-textarea"
              placeholder="Call ke baad koi notes likhein..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {lead.callHistory?.length > 0 && (
            <div className="modal-field">
              <label>Call History</label>
              <div className="call-history">
                {[...lead.callHistory].reverse().slice(0, 5).map((h, i) => (
                  <div key={i} className="history-item">
                    <span
                      className="history-status"
                      style={{ color: CALL_STATUSES.find(s => s.value === h.status)?.color || '#888' }}
                    >
                      {CALL_STATUSES.find(s => s.value === h.status)?.label || h.status}
                    </span>
                    <span className="history-notes">{h.notes || '—'}</span>
                    <span className="history-time mono">
                      {new Date(h.timestamp).toLocaleString('hi-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={saving}
            style={{ background: selectedStatus ? `linear-gradient(135deg, ${selectedStatus.color}, ${selectedStatus.color}cc)` : undefined }}
          >
            {saving ? '⏳ Saving...' : '✓ Save Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
