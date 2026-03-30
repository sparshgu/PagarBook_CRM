import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import LeadTable from '../../components/LeadTable';
import '../AdminDashboard.css';

export default function AdminPayment() {
  const { leads } = useData();
  const { allStaff } = useAuth();
  const payments = leads.filter(l => l.status === 'payment');

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">💰 Payment Leads</h1>
          <p className="section-subtitle">Jin leads ne payment karne ko kaha — {payments.length} total</p>
        </div>
      </div>
      <div className="card">
        {payments.length === 0
          ? <p style={{ color: 'var(--text-dim)', padding: 40, textAlign: 'center' }}>Koi payment lead nahi hai.</p>
          : <LeadTable leads={payments} showAssignee staffList={allStaff} readOnly />
        }
      </div>
    </div>
  );
}
