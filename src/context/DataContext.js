import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext(null);

export const CALL_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#555577' },
  { value: 'busy', label: 'Call Busy', color: '#AA88FF' },
  { value: 'not_received', label: 'Not Received', color: '#FF8C55' },
  { value: 'call_cut', label: 'Call Cut', color: '#FF6B99' },
  { value: 'follow_up', label: 'Follow Up', color: '#FFAA00' },
  { value: 'follow_up_demo', label: 'Follow Up for Demo', color: '#00C8FF' },
  { value: 'payment', label: 'Payment', color: '#2979FF' },
  { value: 'not_interested', label: 'Not Interested', color: '#FF4757' },
  { value: 'converted', label: 'Converted', color: '#00D68F' },
];

// Sample seed data for demo
const generateSampleLeads = (staffId, count = 10) => {
  const companies = [
    'Sharma Enterprises', 'Patel Traders', 'Kumar & Sons', 'Singh Industries',
    'Verma Pvt Ltd', 'Gupta Agency', 'Agarwal Textiles', 'Mehta Motors',
    'Jain Jewellers', 'Rao Electronics', 'Mishra Constructions', 'Tiwari Pharma',
    'Bansal Logistics', 'Malhotra Hospitality', 'Chopra Steel',
  ];
  const owners = [
    'Rajesh Sharma', 'Nilesh Patel', 'Suresh Kumar', 'Harpreet Singh',
    'Deepak Verma', 'Manoj Gupta', 'Vikram Agarwal', 'Sanjay Mehta',
    'Rohit Jain', 'Venkat Rao', 'Ajay Mishra', 'Sunil Tiwari',
    'Rakesh Bansal', 'Ashok Malhotra', 'Naveen Chopra',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: uuidv4(),
    assignedTo: staffId,
    companyName: companies[i % companies.length] + ' ' + (Math.floor(Math.random() * 900) + 100),
    ownerName: owners[i % owners.length],
    phone: '9' + Math.floor(Math.random() * 900000000 + 100000000),
    status: 'pending',
    notes: '',
    followUpDate: '',
    callHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

const STORAGE_KEY = 'pagarbook_crm_data';

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  // Seed initial data
  return {
    leads: [
      ...generateSampleLeads('re001', 12),
      ...generateSampleLeads('re002', 10),
      ...generateSampleLeads('re003', 11),
    ]
  };
};

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData);

  const saveData = (newData) => {
    setData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  };

  // Get leads for a specific staff member
  const getLeadsForStaff = (staffId) => {
    return data.leads.filter(l => l.assignedTo === staffId);
  };

  // Update lead status
  const updateLeadStatus = (leadId, status, notes = '', followUpDate = '') => {
    const updated = data.leads.map(lead => {
      if (lead.id !== leadId) return lead;
      return {
        ...lead,
        status,
        notes,
        followUpDate,
        callHistory: [
          ...lead.callHistory,
          {
            status,
            notes,
            timestamp: new Date().toISOString(),
          }
        ],
        updatedAt: new Date().toISOString(),
      };
    });
    saveData({ ...data, leads: updated });
  };

  // Add bulk leads (from Excel import or manual admin add)
  const addLeads = (newLeads, staffId) => {
    const withMeta = newLeads.map(l => ({
      id: uuidv4(),
      assignedTo: staffId,
      companyName: l.companyName || l['Company Name'] || '',
      ownerName: l.ownerName || l['Owner Name'] || '',
      phone: String(l.phone || l['Phone'] || ''),
      status: 'pending',
      notes: '',
      followUpDate: '',
      callHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    saveData({ ...data, leads: [...data.leads, ...withMeta] });
  };

  // Add single lead
  const addSingleLead = (lead, staffId) => {
    const newLead = {
      id: uuidv4(),
      assignedTo: staffId,
      companyName: lead.companyName,
      ownerName: lead.ownerName,
      phone: String(lead.phone),
      status: 'pending',
      notes: '',
      followUpDate: '',
      callHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveData({ ...data, leads: [...data.leads, newLead] });
  };

  // Reassign not_interested leads back to admin pool (unassign)
  const getNotInterestedLeads = () =>
    data.leads.filter(l => l.status === 'not_interested');

  const reassignLead = (leadId, newStaffId) => {
    const updated = data.leads.map(lead =>
      lead.id === leadId
        ? { ...lead, assignedTo: newStaffId, status: 'pending', updatedAt: new Date().toISOString() }
        : lead
    );
    saveData({ ...data, leads: updated });
  };

  // Delete a lead
  const deleteLead = (leadId) => {
    const updated = data.leads.filter(l => l.id !== leadId);
    saveData({ ...data, leads: updated });
  };

  // Stats helpers
  const getStats = (leads) => {
    const total = leads.length;
    const byStatus = {};
    CALL_STATUSES.forEach(s => { byStatus[s.value] = 0; });
    leads.forEach(l => {
      if (byStatus[l.status] !== undefined) byStatus[l.status]++;
    });
    return { total, byStatus };
  };

  return (
    <DataContext.Provider value={{
      leads: data.leads,
      getLeadsForStaff,
      updateLeadStatus,
      addLeads,
      addSingleLead,
      getNotInterestedLeads,
      reassignLead,
      deleteLead,
      getStats,
      CALL_STATUSES,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
