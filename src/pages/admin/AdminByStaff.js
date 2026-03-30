import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import LeadTable from '../../components/LeadTable';
import AddLeadModal from '../../components/AddLeadModal';
import StatCard from '../../components/StatCard';
import '../AdminDashboard.css';

export default function AdminByStaff() {
  const { leads, getStats } = useData();
  const { allStaff } = useAuth();
  const [selectedStaff, setSelectedStaff] = useState(allStaff[0]?.id || '');
  const [showAdd, setShowAdd] = useState(false);

  const staffLeads = leads.filter(l => l.assignedTo === selectedStaff);
  const stats = getStats(staffLeads);
  const staffName = allStaff.find(s => s.id === selectedStaff)?.name || '';

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">👥 Staff-wise Leads</h1>
          <p className="section-subtitle">Ek RE ka data individually dekhein</p>
        </div>
        <button className="primary-btn" onClick={() => setShowAdd(true)}>
          ➕ Lead Add Karein
        </button>
      </div>

      {/* Staff selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {allStaff.map(staff => {
          const sl = leads.filter(l => l.assignedTo === staff.id);
          return (
            <button
              key={staff.id}
              onClick={() => setSelectedStaff(staff.id)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-sm)',
                border: selectedStaff === staff.id ? '2px solid var(--primary)' : '1.5px solid var(--border)',
                background: selectedStaff === staff.id ? 'rgba(255,107,43,0.15)' : 'rgba(255,255,255,0.04)',
                color: selectedStaff === staff.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {staff.name} <span style={{ opacity: 0.6, fontSize: 12 }}>({sl.length})</span>
            </button>
          );
        })}
      </div>

      {/* Mini stats for selected staff */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', marginBottom: 20 }}>
        <StatCard label="Total" value={staffLeads.length} color="#F0F0FF" icon="📋" />
        <StatCard label="Follow Up" value={stats.byStatus.follow_up} color="#FFAA00" icon="📅" />
        <StatCard label="Demo" value={stats.byStatus.follow_up_demo} color="#00C8FF" icon="🎯" />
        <StatCard label="Payment" value={stats.byStatus.payment} color="#2979FF" icon="💰" />
        <StatCard label="Converted" value={stats.byStatus.converted} color="#00D68F" icon="✅" />
        <StatCard label="Not Interested" value={stats.byStatus.not_interested} color="#FF4757" icon="❌" />
      </div>

      <div className="card">
        <div style={{ marginBottom: 16, fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>
          {staffName} ke leads
        </div>
        <LeadTable leads={staffLeads} readOnly />
      </div>

      {showAdd && <AddLeadModal staffList={allStaff} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
