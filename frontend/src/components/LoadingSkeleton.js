export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const skeletons = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        {skeletons.map((_, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ height: '16px', background: 'var(--border)', borderRadius: '4px', width: '70%', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ height: '20px', background: 'var(--border)', borderRadius: '20px', width: '60px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ height: '20px', background: 'var(--border)', borderRadius: '20px', width: '80px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            </div>
            <div style={{ height: '12px', background: 'var(--border)', borderRadius: '4px', width: '50%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '22px' }}>
            <div style={{ height: '12px', background: 'var(--border)', borderRadius: '4px', width: '60%', marginBottom: '12px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: '32px', background: 'var(--border)', borderRadius: '4px', width: '40%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  }

  return null;
}
