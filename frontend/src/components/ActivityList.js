import React from 'react';

export default function ActivityList({ items = [], onViewAll }) {
  const DOT  = { high: '#f87171', medium: 'var(--gold)', low: '#6ee7b7', resolved: '#6ee7b7', in_progress: 'var(--gold)', reported: '#93c5fd' };

  return (
    <div style={{ background: 'var(--bg-dark)', borderRadius: '12px', padding: '20px 22px', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>Activity</span>
        <button onClick={onViewAll} style={{ background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>View All</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
        {items.length === 0 && <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--muted)', margin: 0 }}>No recent activity</p>}
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0, marginTop: '5px', background: DOT[item.dot] || 'var(--muted)' }} />
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: 'var(--muted)', lineHeight: '1.6' }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
