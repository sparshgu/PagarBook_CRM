import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import LeadTable from '../../components/LeadTable';
import '../AdminDashboard.css';

export function StaffFollowUp() {
  const { user } = useAuth();
  const { getLeadsForStaff } = useData();
  const myLeads = getLeadsForStaff(user.id);
  const followUps = myLeads.filter(l => l.status === 'follow_up' || l.status === 'follow_up_demo');

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">📅 Follow Up Leads</h1>
          <p className="section-subtitle">Jin business owners ko dobara call karna hai — {followUps.length} leads</p>
        </div>
      </div>
      <div className="card">
        {followUps.length === 0
          ? <p style={{ color: 'var(--text-dim)', padding: 40, textAlign: 'center' }}>Koi follow up pending nahi! 🎉</p>
          : <LeadTable leads={followUps} />}
      </div>
    </div>
  );
}

export function StaffConverted() {
  const { user } = useAuth();
  const { getLeadsForStaff } = useData();
  const myLeads = getLeadsForStaff(user.id);
  const converted = myLeads.filter(l => l.status === 'converted');

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">✅ Converted Leads</h1>
          <p className="section-subtitle">Meri taraf se converted leads — {converted.length} total 🎉</p>
        </div>
      </div>
      <div className="card">
        {converted.length === 0
          ? <p style={{ color: 'var(--text-dim)', padding: 40, textAlign: 'center' }}>Abhi koi converted nahi, keep calling! 💪</p>
          : <LeadTable leads={converted} readOnly />}
      </div>
    </div>
  );
}

export function StaffPayment() {
  const { user } = useAuth();
  const { getLeadsForStaff } = useData();
  const myLeads = getLeadsForStaff(user.id);
  const payments = myLeads.filter(l => l.status === 'payment');

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">💰 Payment Leads</h1>
          <p className="section-subtitle">Jin leads ne payment karne ko kaha — {payments.length} leads</p>
        </div>
      </div>
      <div className="card">
        {payments.length === 0
          ? <p style={{ color: 'var(--text-dim)', padding: 40, textAlign: 'center' }}>Koi payment lead nahi hai abhi.</p>
          : <LeadTable leads={payments} />}
      </div>
    </div>
  );
}

export default StaffFollowUp;
