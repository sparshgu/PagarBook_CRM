import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import StaffMyLeads from './staff/StaffMyLeads';
import StaffFollowUp from './staff/StaffFollowUp';
import StaffConverted from './staff/StaffConverted';
import StaffPayment from './staff/StaffPayment';
import StaffOverview from './staff/StaffOverview';
import './AdminDashboard.css';

const TABS = [
  { key: 'overview', label: 'My Stats', icon: '📊' },
  { key: 'all', label: 'All Leads', icon: '📋' },
  { key: 'followup', label: 'Follow Up', icon: '📅' },
  { key: 'payment', label: 'Payment', icon: '💰' },
  { key: 'converted', label: 'Converted', icon: '✅' },
];

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <StaffOverview />;
      case 'all': return <StaffMyLeads />;
      case 'followup': return <StaffFollowUp />;
      case 'payment': return <StaffPayment />;
      case 'converted': return <StaffConverted />;
      default: return <StaffOverview />;
    }
  };

  return (
    <div className="dashboard-root">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={TABS} />
      <main className="dashboard-main page-enter">
        {renderTab()}
      </main>
    </div>
  );
}
