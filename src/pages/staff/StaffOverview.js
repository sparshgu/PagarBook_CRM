import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/StatCard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import '../AdminDashboard.css';

export default function StaffOverview() {
  const { user } = useAuth();
  const { getLeadsForStaff, getStats, CALL_STATUSES } = useData();

  const myLeads = getLeadsForStaff(user.id);
  const stats = getStats(myLeads);

  const today = new Date().toLocaleDateString('hi-IN');

  const pieData = CALL_STATUSES
    .filter(s => stats.byStatus[s.value] > 0)
    .map(s => ({ name: s.label, value: stats.byStatus[s.value], color: s.color }));

  const urgentFollowUps = myLeads.filter(l =>
    (l.status === 'follow_up' || l.status === 'follow_up_demo') &&
    l.followUpDate && new Date(l.followUpDate) <= new Date()
  );

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">👋 Namaste, {user.name.split(' ')[0]}!</h1>
          <p className="section-subtitle">Aaj ka din — {today} — apne leads manage karein</p>
        </div>
      </div>

      {urgentFollowUps.length > 0 && (
        <div style={{
          background: 'rgba(255,170,0,0.1)',
          border: '1px solid rgba(255,170,0,0.35)',
          borderRadius: 'var(--radius)',
          padding: '14px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 14,
          color: '#FFAA00',
        }}>
          ⚠️ <strong>{urgentFollowUps.length} follow up(s)</strong> aaj due hain! Inhe call karo.
        </div>
      )}

      <div className="stats-grid">
        <StatCard label="Total Leads" value={myLeads.length} color="#F0F0FF" icon="📋" />
        <StatCard label="Pending" value={stats.byStatus.pending} color="#555577" icon="⏳" />
        <StatCard label="Follow Up" value={stats.byStatus.follow_up} color="#FFAA00" icon="📅" />
        <StatCard label="Demo" value={stats.byStatus.follow_up_demo} color="#00C8FF" icon="🎯" />
        <StatCard label="Payment" value={stats.byStatus.payment} color="#2979FF" icon="💰" />
        <StatCard label="Converted" value={stats.byStatus.converted} color="#00D68F" icon="✅" />
        <StatCard label="Not Interested" value={stats.byStatus.not_interested} color="#FF4757" icon="❌" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, marginTop: 4 }}>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            📊 Mere Leads ka Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" outerRadius={90} dataKey="value" stroke="none">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend formatter={(v) => <span style={{ color: '#8888AA', fontSize: 12 }}>{v}</span>} />
              <Tooltip contentStyle={{ background: '#13132A', border: '1px solid #222244', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            🔔 Upcoming Follow Ups
          </h3>
          {myLeads.filter(l => l.followUpDate).length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Koi follow up schedule nahi hai.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myLeads
                .filter(l => l.followUpDate)
                .sort((a, b) => a.followUpDate.localeCompare(b.followUpDate))
                .slice(0, 8)
                .map(lead => (
                  <div key={lead.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                  }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--warning)', fontSize: 12, minWidth: 90 }}>
                      {lead.followUpDate}
                    </span>
                    <span style={{ fontWeight: 600, flex: 1 }}>{lead.companyName}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{lead.ownerName}</span>
                    <span style={{
                      background: lead.status === 'follow_up_demo' ? 'rgba(0,200,255,0.15)' : 'rgba(255,170,0,0.15)',
                      color: lead.status === 'follow_up_demo' ? '#00C8FF' : '#FFAA00',
                      padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 700,
                    }}>
                      {lead.status === 'follow_up_demo' ? 'Demo' : 'Follow Up'}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
