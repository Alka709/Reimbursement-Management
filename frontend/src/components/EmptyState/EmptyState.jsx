import React from 'react';

function EmptyState({ title = 'No results found', message = 'There is no data available to display at this time.' }) {
  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      textAlign: 'center',
      gap: '1rem',
      background: 'var(--color-bg-white)',
      border: '1px dashed var(--color-primary)'
    }}>
      <div style={{ fontSize: '3rem' }}>🔍</div>
      <div>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text)', marginBottom: '0.25rem', fontWeight: '700' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          {message}
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
