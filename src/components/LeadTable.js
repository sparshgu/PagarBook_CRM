import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import StatusBadge from './StatusBadge';
import UpdateLeadModal from './UpdateLeadModal';
import './LeadTable.css';

export default function LeadTable({ leads, showAssignee = false, staffList = [], readOnly = false }) {
  const { CALL_STATUSES } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [sortField, setSortField] = useState('updatedAt');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.companyName?.toLowerCase().includes(q) ||
        l.ownerName?.toLowerCase().includes(q) ||
        l.phone?.includes(q)
      );
    }
    if (filterStatus !== 'all') {
      result = result.filter(l => l.status === filterStatus);
    }
    result.sort((a, b) => {
      const va = a[sortField] || '';
      const vb = b[sortField] || '';
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return result;
  }, [leads, search, filterStatus, sortField, sortDir]);

  const getStaffName = (id) => {
    const s = staffList.find(s => s.id === id);
    return s ? s.name : id;
  };

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  return (
    <div className="lead-table-container">
      <div className="table-controls">
        <input
          className="table-search"
          placeholder="🔍  Search by company, name, phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="table-filter"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          {CALL_STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <span className="table-count">{filtered.length} leads</span>
      </div>

      <div className="table-scroll">
        <table className="lead-table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort('companyName')} className="sortable">
                Company {sortField === 'companyName' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th onClick={() => handleSort('ownerName')} className="sortable">
                Owner {sortField === 'ownerName' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              <th>Phone</th>
              <th>Status</th>
              {showAssignee && <th>RE Name</th>}
              <th>Notes</th>
              <th>Follow Up</th>
              <th onClick={() => handleSort('updatedAt')} className="sortable">
                Updated {sortField === 'updatedAt' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
              </th>
              {!readOnly && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={readOnly ? 8 : 9} className="empty-row">
                  Koi lead nahi mili 🔍
                </td>
              </tr>
            ) : filtered.map((lead, i) => (
              <tr key={lead.id} className={`lead-row status-row-${lead.status}`}>
                <td className="row-num mono">{i + 1}</td>
                <td className="company-cell">
                  <span className="company-name">{lead.companyName}</span>
                </td>
                <td>{lead.ownerName}</td>
                <td className="mono phone-cell">{lead.phone}</td>
                <td><StatusBadge status={lead.status} /></td>
                {showAssignee && <td className="assignee-cell">{getStaffName(lead.assignedTo)}</td>}
                <td className="notes-cell" title={lead.notes}>{lead.notes || '—'}</td>
                <td className="followup-cell mono">{lead.followUpDate || '—'}</td>
                <td className="date-cell mono">
                  {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString('hi-IN') : '—'}
                </td>
                {!readOnly && (
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => setSelectedLead(lead)}
                    >
                      Update
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLead && (
        <UpdateLeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
