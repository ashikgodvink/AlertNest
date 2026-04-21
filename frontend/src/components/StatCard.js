export default function StatCard({ label, value, subtitle, icon, trend = 'up' }) {
  return (
    <div style={{
      background: 'var(--bg-dark)',
      border: '1px solid var(--border)',
      padding: '24px 26px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '120px',
      transition: 'background 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-dark)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
        {icon && <span style={{ color: 'var(--gold)', opacity: 0.7 }}>{icon}</span>}
      </div>
      <div>
        <p style={{ margin: '12px 0 6px', fontSize: '36px', fontWeight: '400', color: 'var(--text)', lineHeight: 1, letterSpacing: '-1px' }}>{value ?? '—'}</p>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: trend === 'down' ? '#f87171' : 'var(--gold)', letterSpacing: '0.05em' }}>
          {trend === 'down' ? '↓' : '↑'} {subtitle}
        </p>
      </div>
    </div>
  );
}
