import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import LeadTable from '../../components/LeadTable';
import AddLeadModal from '../../components/AddLeadModal';
import '../AdminDashboard.css';

export default function AdminAllLeads() {
  const { leads } = useData();
  const { allStaff } = useAuth();
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">📋 All Leads</h1>
          <p className="section-subtitle">Sabhi REs ke leads ek jagah — {leads.length} total</p>
        </div>
        <button className="primary-btn" onClick={() => setShowAdd(true)}>
          ➕ Lead Add Karein
        </button>
      </div>

      <div className="card">
        <LeadTable leads={leads} showAssignee staffList={allStaff} readOnly />
      </div>

      {showAdd && <AddLeadModal staffList={allStaff} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
