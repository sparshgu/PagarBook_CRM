import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import LeadTable from '../../components/LeadTable';
import '../AdminDashboard.css';

export default function StaffMyLeads() {
  const { user } = useAuth();
  const { getLeadsForStaff } = useData();
  const myLeads = getLeadsForStaff(user.id);

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">📋 Mere Saare Leads</h1>
          <p className="section-subtitle">
            Apne saare assigned leads dekhein aur update karein — {myLeads.length} total
          </p>
        </div>
      </div>
      <div className="card">
        <LeadTable leads={myLeads} />
      </div>
    </div>
  );
}
