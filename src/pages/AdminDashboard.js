import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Navbar from '../components/Navbar';
import AdminOverview from './admin/AdminOverview';
import AdminAllLeads from './admin/AdminAllLeads';
import AdminByStaff from './admin/AdminByStaff';
import AdminConverted from './admin/AdminConverted';
import AdminFollowUp from './admin/AdminFollowUp';
import AdminPayment from './admin/AdminPayment';
import AdminNotInterested from './admin/AdminNotInterested';
import './AdminDashboard.css';

const TABS = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'all', label: 'All Leads', icon: '📋' },
  { key: 'bystaff', label: 'By Staff', icon: '👥' },
  { key: 'followup', label: 'Follow Up', icon: '📅' },
  { key: 'payment', label: 'Payment', icon: '💰' },
  { key: 'converted', label: 'Converted', icon: '✅' },
  { key: 'notinterested', label: 'Not Interested', icon: '❌' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />;
      case 'all': return <AdminAllLeads />;
      case 'bystaff': return <AdminByStaff />;
      case 'followup': return <AdminFollowUp />;
      case 'payment': return <AdminPayment />;
      case 'converted': return <AdminConverted />;
      case 'notinterested': return <AdminNotInterested />;
      default: return <AdminOverview />;
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
