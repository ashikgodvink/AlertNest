import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SocialButtons from '../components/SocialButtons';
import { FaLeaf, FaGraduationCap, FaTools, FaEye, FaEyeSlash } from 'react-icons/fa';
import { COLORS } from '../utils/colors';

export default function Signup({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm]     = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly
  // Using CSS variables directly

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      setSuccess('Account created! Logging you in...');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Email already registered' : err.message);
    } finally { setLoading(false); }
  };

  const label = { fontSize: '11px', fontWeight: '600', color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', display: 'block' };
  const inputSt = { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '6px', padding: '12px 14px', fontSize: '13px', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' };

  const ROLES = [
    { value: 'student', icon: FaGraduationCap, label: 'Student', sub: 'Report incidents' },
    { value: 'staff',   icon: FaTools,  label: 'Staff',   sub: 'Manage & resolve' },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: 'hidden' }}>

      {/* Left branding panel */}
      <div style={{ width: '42%', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(200,135,58,0.1)', top: '50%', left: '10%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--gold)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaLeaf size={16} color="#fff" /></div>
          <span style={{ color: 'var(--text)', fontWeight: '700', fontSize: '16px', letterSpacing: '1px' }}>ALERTNEST</span>
        </div>

        <div style={{ position: 'relative' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '52px', fontWeight: '700', color: 'var(--text)', lineHeight: 1.1 }}>Report.</h1>
          <h1 style={{ margin: '0 0 4px', fontSize: '52px', fontWeight: '700', color: 'var(--gold)', lineHeight: 1.1, fontStyle: 'italic' }}>Track.</h1>
          <h1 style={{ margin: '0 0 24px', fontSize: '52px', fontWeight: '700', color: 'var(--text)', lineHeight: 1.1 }}>Resolve.</h1>
          <p style={{ margin: '0 0 32px', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '320px' }}>
            Join AlertNest and help keep your campus safe and accountable.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['INCIDENTS', 'TRACKING', 'ANALYTICS'].map(t => (
              <span key={t} style={{ border: '1px solid var(--border)', color: 'var(--muted)', fontSize: '10px', fontWeight: '600', padding: '5px 12px', borderRadius: '4px', letterSpacing: '0.8px' }}>{t}</span>
            ))}
          </div>
        </div>

        <p style={{ position: 'relative', fontSize: '11px', color: 'var(--muted)', margin: 0 }}>© 2026 AlertNest</p>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', overflowY: 'auto' }}>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '8px', padding: '4px', marginBottom: '32px', width: '100%', maxWidth: '360px' }}>
          <button onClick={onSwitch} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', letterSpacing: '0.5px' }}>SIGN IN</button>
          <button style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'default', background: 'var(--gold)', color: '#fff', fontWeight: '700', fontSize: '13px', letterSpacing: '0.5px' }}>SIGN UP</button>
        </div>

        <div style={{ width: '100%', maxWidth: '360px' }}>
          <h2 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '700', color: 'var(--text)' }}>Create account</h2>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--muted)' }}>Join your AlertNest campus network.</p>

          {error   && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '14px', background: 'rgba(248,113,113,0.1)', padding: '10px 14px', borderRadius: '6px' }}>{error}</p>}
          {success && <p style={{ color: '#6ee7b7', fontSize: '12px', marginBottom: '14px', background: 'rgba(110,231,183,0.1)', padding: '10px 14px', borderRadius: '6px' }}>{success}</p>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Role selector */}
            <div>
              <label style={label}>I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {ROLES.map(r => (
                  <button key={r.value} type="button" onClick={() => setForm({ ...form, role: r.value })} style={{
                    padding: '12px 8px', borderRadius: '8px', border: form.role === r.value ? '1px solid var(--gold)' : '1px solid var(--border)',
                    background: form.role === r.value ? 'rgba(200,135,58,0.12)' : 'var(--bg-input)',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                  }}>
                  <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                    <r.icon size={20} color={form.role === r.value ? 'var(--gold)' : 'var(--muted)'} />
                  </div>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: form.role === r.value ? 'var(--gold)' : 'var(--text)' }}>{r.label}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: 'var(--muted)' }}>{r.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={label}>Full Name</label>
              <input type="text" placeholder="Your name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required style={inputSt} />
            </div>

            <div>
              <label style={label}>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required style={inputSt} />
            </div>

            <div>
              <label style={label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required
                  style={{ ...inputSt, paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)',
                }}>
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: '6px',
              padding: '13px', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              letterSpacing: '0.8px', opacity: loading ? 0.7 : 1, marginTop: '4px',
            }}>
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <SocialButtons onError={setError} label="Sign Up" />

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '20px' }}>
            Already have an account?{' '}
            <button onClick={onSwitch} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
