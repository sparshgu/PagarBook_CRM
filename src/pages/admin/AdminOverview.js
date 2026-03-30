import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import '../AdminDashboard.css';

const STATUS_DISPLAY = [
  { key: 'converted', label: 'Converted', color: '#00D68F', icon: '✅' },
  { key: 'payment', label: 'Payment', color: '#2979FF', icon: '💰' },
  { key: 'follow_up_demo', label: 'Demo Pending', color: '#00C8FF', icon: '🎯' },
  { key: 'follow_up', label: 'Follow Up', color: '#FFAA00', icon: '📅' },
  { key: 'not_interested', label: 'Not Interested', color: '#FF4757', icon: '❌' },
  { key: 'busy', label: 'Busy', color: '#AA88FF', icon: '📵' },
  { key: 'not_received', label: 'Not Received', color: '#FF8C55', icon: '📴' },
  { key: 'call_cut', label: 'Call Cut', color: '#FF6B99', icon: '📞' },
  { key: 'pending', label: 'Pending', color: '#555577', icon: '⏳' },
];

export default function AdminOverview() {
  const { leads, getStats } = useData();
  const { allStaff } = useAuth();
  const stats = getStats(leads);

  // Per-staff bar chart data
  const staffChartData = allStaff.map(staff => {
    const staffLeads = leads.filter(l => l.assignedTo === staff.id);
    const s = getStats(staffLeads);
    return {
      name: staff.name.split(' ')[0],
      Converted: s.byStatus.converted,
      Payment: s.byStatus.payment,
      'Follow Up': s.byStatus.follow_up + s.byStatus.follow_up_demo,
      'Not Interested': s.byStatus.not_interested,
      Pending: s.byStatus.pending,
    };
  });

  // Pie chart
  const pieData = STATUS_DISPLAY
    .filter(s => stats.byStatus[s.key] > 0)
    .map(s => ({ name: s.label, value: stats.byStatus[s.key], color: s.color }));

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-title">📊 Admin Overview</h1>
          <p className="section-subtitle">Saare Relationship Executives ka combined performance</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stats-grid">
        <StatCard label="Total Leads" value={stats.total} color="#F0F0FF" icon="📋" />
        {STATUS_DISPLAY.slice(0, 6).map(s => (
          <StatCard
            key={s.key}
            label={s.label}
            value={stats.byStatus[s.key] || 0}
            color={s.color}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 28 }}>
        {/* Bar Chart - Per Staff */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
            👥 Staff Performance Comparison
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={staffChartData} barSize={14}>
              <XAxis dataKey="name" tick={{ fill: '#8888AA', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8888AA', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#13132A', border: '1px solid #222244', borderRadius: 8 }}
                labelStyle={{ color: '#F0F0FF' }}
              />
              <Bar dataKey="Converted" fill="#00D68F" radius={[3,3,0,0]} />
              <Bar dataKey="Payment" fill="#2979FF" radius={[3,3,0,0]} />
              <Bar dataKey="Follow Up" fill="#FFAA00" radius={[3,3,0,0]} />
              <Bar dataKey="Not Interested" fill="#FF4757" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Overall */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
            🔵 Lead Status Split
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" outerRadius={90} dataKey="value" stroke="none">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend
                formatter={(v) => <span style={{ color: '#8888AA', fontSize: 12 }}>{v}</span>}
              />
              <Tooltip
                contentStyle={{ background: '#13132A', border: '1px solid #222244', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per Staff Summary Table */}
      <div className="card">
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text)' }}>
          📋 Staff-wise Summary
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={thStyle}>Staff Name</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Pending</th>
                <th style={{ ...thStyle, color: '#FFAA00' }}>Follow Up</th>
                <th style={{ ...thStyle, color: '#00C8FF' }}>Demo</th>
                <th style={{ ...thStyle, color: '#2979FF' }}>Payment</th>
                <th style={{ ...thStyle, color: '#00D68F' }}>Converted</th>
                <th style={{ ...thStyle, color: '#FF4757' }}>Not Interested</th>
              </tr>
            </thead>
            <tbody>
              {allStaff.map(staff => {
                const sl = leads.filter(l => l.assignedTo === staff.id);
                const s = getStats(sl);
                return (
                  <tr key={staff.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={tdStyle}><span style={{ fontWeight: 600 }}>{staff.name}</span></td>
                    <td style={tdStyle}>{sl.length}</td>
                    <td style={{ ...tdStyle, color: '#555577' }}>{s.byStatus.pending}</td>
                    <td style={{ ...tdStyle, color: '#FFAA00' }}>{s.byStatus.follow_up}</td>
                    <td style={{ ...tdStyle, color: '#00C8FF' }}>{s.byStatus.follow_up_demo}</td>
                    <td style={{ ...tdStyle, color: '#2979FF' }}>{s.byStatus.payment}</td>
                    <td style={{ ...tdStyle, color: '#00D68F', fontWeight: 700 }}>{s.byStatus.converted}</td>
                    <td style={{ ...tdStyle, color: '#FF4757' }}>{s.byStatus.not_interested}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: '10px 14px', textAlign: 'left', fontWeight: 700, fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '11px 14px', color: 'var(--text)' };
