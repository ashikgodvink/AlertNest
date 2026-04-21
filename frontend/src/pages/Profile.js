import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaLeaf, FaGraduationCap, FaTools, FaCrown, FaEnvelope, FaChartBar } from 'react-icons/fa';

export default function Profile({ onBack, summary }) {
  const { user, logout } = useAuth();
  const role = user?.role || 'student';

  const ROLE_CONFIG = {
    admin:   { icon: FaCrown,          color: '#c8873a', bg: 'rgba(200,135,58,0.15)',   label: 'Admin',   desc: 'Full system access' },
    staff:   { icon: FaTools,          color: '#6ee7b7', bg: 'rgba(110,231,183,0.12)',  label: 'Staff',   desc: 'Manage & resolve incidents' },
    student: { icon: FaGraduationCap,  color: '#93c5fd', bg: 'rgba(147,197,253,0.12)', label: 'Student', desc: 'Report incidents' },
  };

  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.student;
  const RoleIcon = rc.icon;

  const stats = [
    { label: 'Total',       value: summary?.total        ?? '—', color: 'var(--gold)' },
    { label: 'Resolved',    value: summary?.resolved     ?? '—', color: '#6ee7b7' },
    { label: 'In Progress', value: summary?.in_progress  ?? '—', color: '#c8873a' },
    { label: 'Rate',        value: summary?.resolution_rate != null ? `${summary.resolution_rate}%` : '—', color: '#93c5fd' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: 'hidden' }}>

      {/* Left branding panel */}
      <div style={{ width: '42%', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(200,135,58,0.1)', top: '50%', left: '10%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', border: '1px solid rgba(200,135,58,0.06)', top: '50%', left: '-10%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--gold)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaLeaf size={16} color="#fff" />
          </div>
          <span style={{ color: 'var(--text)', fontWeight: '700', fontSize: '16px', letterSpacing: '1px' }}>ALERTNEST</span>
        </div>

        {/* Avatar + name */}
        <div style={{ position: 'relative' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '32px', marginBottom: '20px' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '36px', fontWeight: '700', color: 'var(--text)', lineHeight: 1.1 }}>
            {user?.name || 'User'}
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: rc.bg, borderRadius: '20px', border: `1px solid ${rc.color}30`, marginBottom: '28px' }}>
            <RoleIcon size={13} color={rc.color} />
            <span style={{ fontSize: '12px', fontWeight: '700', color: rc.color, letterSpacing: '0.05em' }}>{rc.label}</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '300px' }}>
            {rc.desc}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '28px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '600', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: 'relative', fontSize: '11px', color: 'var(--muted)', margin: 0 }}>© 2026 AlertNest</p>
      </div>

      {/* Right content panel */}
      <div style={{ flex: 1, background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', padding: '36px 48px', overflowY: 'auto' }}>

        {/* Back button */}
        <button onClick={onBack} style={{
          background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '40px',
          alignSelf: 'flex-start', padding: 0,
        }}>
          <FaArrowLeft size={11} /> Back to Dashboard
        </button>

        <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: 'var(--text)' }}>My Profile</h2>
        <p style={{ margin: '0 0 36px', fontSize: '13px', color: 'var(--muted)' }}>Your account information and activity</p>

        {/* Account details */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>Account Details</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {[
              { icon: FaEnvelope, label: 'Email', value: user?.email || '—' },
              { icon: RoleIcon,   label: 'Role',  value: rc.label, color: rc.color },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--bg-input)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <f.icon size={14} style={{ color: 'var(--muted)' }} />
                  <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--muted)' }}>{f.label}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: f.color || 'var(--text)' }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incident summary */}
        <div style={{ marginBottom: '36px' }}>
          <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            <FaChartBar size={11} style={{ marginRight: '6px' }} />
            Incident Summary
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ padding: '20px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '600', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '32px', fontWeight: '700', color: s.color, lineHeight: 1 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign out */}
        <button onClick={logout} style={{
          width: '100%',
          background: 'transparent',
          color: '#f87171',
          border: '1px solid rgba(248,113,113,0.3)',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '12px',
          fontWeight: '700',
          cursor: 'pointer',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
