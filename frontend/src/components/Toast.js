import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const config = {
    success: { icon: <FaCheckCircle size={18} />, bg: 'rgba(110,231,183,0.15)', color: '#6ee7b7', border: 'rgba(110,231,183,0.3)' },
    error: { icon: <FaExclamationCircle size={18} />, bg: 'rgba(248,113,113,0.15)', color: '#f87171', border: 'rgba(248,113,113,0.3)' },
    info: { icon: <FaInfoCircle size={18} />, bg: 'rgba(200,135,58,0.15)', color: 'var(--gold)', border: 'rgba(200,135,58,0.3)' },
  };

  const style = config[type] || config.info;

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 1000,
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '12px',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '280px',
      maxWidth: '400px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.3s ease-out',
    }}>
      <div style={{ color: style.color, flexShrink: 0 }}>{style.icon}</div>
      <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: style.color, flex: 1, lineHeight: 1.4 }}>{message}</p>
      {onClose && (
        <button onClick={onClose} style={{
          background: 'transparent',
          border: 'none',
          color: style.color,
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0',
          opacity: 0.6,
          flexShrink: 0,
        }}>×</button>
      )}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
