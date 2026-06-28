import React from 'react';

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-card-icon">{icon}</div>}
      <div>
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-value">{value}</div>
      </div>
    </div>
  );
}

export default StatCard;
