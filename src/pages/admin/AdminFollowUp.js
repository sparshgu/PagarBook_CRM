import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import LeadTable from '../../components/LeadTable';
import '../AdminDashboard.css';

export default function AdminFollowUp() {
  const { leads } = useData();
  const { allStaff } = useAuth();
  const followUps = leads.filter(l => l.status === 'follow_up' || l.status === 'follow_up_demo');

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">📅 Follow Up Leads</h1>
          <p className="section-subtitle">Jin leads ke saath follow up karna hai — {followUps.length} total</p>
        </div>
      </div>
      <div className="card">
        {followUps.length === 0
          ? <p style={{ color: 'var(--text-dim)', padding: 40, textAlign: 'center' }}>Koi follow up pending nahi.</p>
          : <LeadTable leads={followUps} showAssignee staffList={allStaff} readOnly />
        }
      </div>
    </div>
  );
}
