import React from 'react';
import './StatCard.css';

export default function StatCard({ label, value, color, icon, subtitle }) {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
      <div className="stat-glow" />
    </div>
  );
}
