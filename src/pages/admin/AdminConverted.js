import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import LeadTable from '../../components/LeadTable';
import '../AdminDashboard.css';

export default function AdminConverted() {
  const { leads } = useData();
  const { allStaff } = useAuth();
  const converted = leads.filter(l => l.status === 'converted');

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">✅ Converted Leads</h1>
          <p className="section-subtitle">Jo business owners ne PagarBook le liya — {converted.length} total</p>
        </div>
      </div>
      <div className="card">
        {converted.length === 0
          ? <p style={{ color: 'var(--text-dim)', padding: 40, textAlign: 'center' }}>Abhi koi converted lead nahi hai.</p>
          : <LeadTable leads={converted} showAssignee staffList={allStaff} readOnly />
        }
      </div>
    </div>
  );
}
