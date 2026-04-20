import { useAuth } from '../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';
import { COLORS } from '../utils/colors';

export default function Profile({ onBack, summary }) {
  const { user, logout } = useAuth();
  const role  = user?.role || 'student';

  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly

  const ROLE_BADGE = {
    admin:   { bg: 'rgba(200,135,58,0.15)', color: '#c8873a', label: 'Admin' },
    staff:   { bg: 'rgba(110,231,183,0.12)', color: '#6ee7b7', label: 'Staff' },
    student: { bg: 'rgba(147,197,253,0.12)', color: '#93c5fd', label: 'Student' },
  };

  const badge = ROLE_BADGE[role] || ROLE_BADGE.student;

  const stats = [
    { label: 'Total',       value: summary?.total        ?? '—' },
    { label: 'Resolved',    value: summary?.resolved     ?? '—' },
    { label: 'In Progress', value: summary?.in_progress  ?? '—' },
    { label: 'Rate',        value: summary?.resolution_rate != null ? `${summary.resolution_rate}%` : '—' },
    { label: 'High',        value: summary?.high         ?? '—' },
    { label: 'Medium',      value: summary?.medium       ?? '—' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', fontFamily: "'Jost', 'Segoe UI', system-ui, sans-serif" }} className="dash-bg">
      <div className="dash-glow" />
      <div className="dash-glow-2" />
      <div className="dash-arc" style={{ width: '500px', height: '500px', top: '0%', right: '-200px' }} />
      <div className="dash-arc" style={{ width: '300px', height: '300px', bottom: '5%', left: '-100px', animationDuration: '15s', animationDirection: 'reverse' }} />

      {/* Topbar */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <FaArrowLeft size={11} /> Back
        </button>
        <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Profile</span>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>

        {/* Avatar + name */}
        <div style={{ border: '1px solid var(--border)', background: 'var(--bg-card)', padding: '32px', display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '1px' }}>
          <div style={{ width: '72px', height: '72px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '300', fontSize: '28px', flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '500', color: 'var(--text)', letterSpacing: '0.08em', fontFamily: "'Oswald', sans-serif" }}>{user?.name || 'User'}</p>
            <span style={{ fontSize: '9px', fontWeight: '600', padding: '3px 10px', background: badge.bg, color: badge.color, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{badge.label}</span>
          </div>
        </div>

        {/* Account info */}
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', background: 'var(--bg-card)', padding: '24px 32px', marginBottom: '1px' }}>
          <p style={{ margin: '0 0 16px', fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Account</p>
          {[
            { label: 'Email', value: user?.email || '—' },
            { label: 'Role',  value: role },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{f.label}</span>
              <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text)', textTransform: f.label === 'Role' ? 'capitalize' : 'none' }}>{f.value}</span>
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <div style={{ border: '1px solid var(--border)', borderTop: 'none', background: 'var(--bg-card)', padding: '24px 32px', marginBottom: '24px' }}>
          <p style={{ margin: '0 0 16px', fontSize: '9px', fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)' }}>Incident Stats</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: 'var(--bg-card)', padding: '16px 14px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '26px', fontWeight: '300', color: 'var(--gold)' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={logout}
          style={{ width: '100%', background: 'transparent', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)', padding: '12px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
