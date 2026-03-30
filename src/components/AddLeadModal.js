import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import * as XLSX from 'xlsx';
import './AddLeadModal.css';

export default function AddLeadModal({ staffList, onClose }) {
  const { addLeads, addSingleLead } = useData();
  const [tab, setTab] = useState('single'); // 'single' | 'bulk'
  const [staffId, setStaffId] = useState(staffList[0]?.id || '');
  const [single, setSingle] = useState({ companyName: '', ownerName: '', phone: '' });
  const [bulkData, setBulkData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const fileRef = useRef();

  const handleSingleSave = async () => {
    if (!single.companyName || !single.ownerName || !single.phone) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    addSingleLead(single, staffId);
    setSaving(false);
    setSuccess(`Lead "${single.companyName}" successfully add ho gaya!`);
    setSingle({ companyName: '', ownerName: '', phone: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws);
      setBulkData(rows);
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkSave = async () => {
    if (!bulkData.length || !staffId) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    addLeads(bulkData, staffId);
    setSaving(false);
    setSuccess(`${bulkData.length} leads successfully add ho gaye!`);
    setBulkData([]);
    setFileName('');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card animate-in" style={{ maxWidth: 600 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Lead Add Karein</h2>
            <p className="modal-subtitle">Single ya bulk Excel upload karein</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="add-tabs">
          <button className={`add-tab ${tab === 'single' ? 'active' : ''}`} onClick={() => setTab('single')}>
            ➕ Single Lead
          </button>
          <button className={`add-tab ${tab === 'bulk' ? 'active' : ''}`} onClick={() => setTab('bulk')}>
            📊 Excel Bulk Upload
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Assign to Staff (RE)</label>
            <select className="modal-input" value={staffId} onChange={e => setStaffId(e.target.value)}>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {tab === 'single' && (
            <>
              <div className="modal-field">
                <label>Company Name</label>
                <input
                  className="modal-input"
                  placeholder="Jaise: Sharma Enterprises"
                  value={single.companyName}
                  onChange={e => setSingle({ ...single, companyName: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label>Owner Name</label>
                <input
                  className="modal-input"
                  placeholder="Jaise: Rajesh Sharma"
                  value={single.ownerName}
                  onChange={e => setSingle({ ...single, ownerName: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label>Phone Number</label>
                <input
                  className="modal-input"
                  placeholder="9876543210"
                  value={single.phone}
                  onChange={e => setSingle({ ...single, phone: e.target.value })}
                  type="tel"
                />
              </div>
            </>
          )}

          {tab === 'bulk' && (
            <>
              <div className="modal-field">
                <label>Excel File Upload (.xlsx / .xls)</label>
                <div className="file-drop" onClick={() => fileRef.current.click()}>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} hidden />
                  <span className="file-icon">📂</span>
                  <span className="file-text">
                    {fileName || 'Click karein ya file drop karein'}
                  </span>
                  <span className="file-hint">
                    Columns: Company Name, Owner Name, Phone
                  </span>
                </div>
              </div>
              {bulkData.length > 0 && (
                <div className="bulk-preview">
                  <p className="preview-title">Preview: {bulkData.length} rows mili</p>
                  <div className="preview-table-wrap">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          {Object.keys(bulkData[0]).slice(0, 4).map(k => <th key={k}>{k}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {bulkData.slice(0, 5).map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).slice(0, 4).map((v, j) => <td key={j}>{String(v)}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {bulkData.length > 5 && <p className="preview-more">...aur {bulkData.length - 5} rows</p>}
                </div>
              )}
            </>
          )}

          {success && <div className="success-msg">✅ {success}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Close</button>
          <button
            className="btn-save"
            onClick={tab === 'single' ? handleSingleSave : handleBulkSave}
            disabled={saving || (tab === 'bulk' && !bulkData.length) || (tab === 'single' && (!single.companyName || !single.phone))}
          >
            {saving ? '⏳ Saving...' : tab === 'single' ? '➕ Lead Add Karein' : `📤 ${bulkData.length} Leads Upload Karein`}
          </button>
        </div>
      </div>
    </div>
  );
}
