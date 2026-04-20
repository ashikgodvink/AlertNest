import { FaExclamationTriangle } from 'react-icons/fa';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel', danger = true }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      animation: 'fadeIn 0.2s ease-out',
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '32px',
        minWidth: '380px',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        animation: 'scaleIn 0.2s ease-out',
      }}>
        {danger && (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(248,113,113,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <FaExclamationTriangle size={22} style={{ color: '#f87171' }} />
          </div>
        )}
        
        <h3 style={{
          margin: '0 0 12px',
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text)',
          letterSpacing: '0.02em',
        }}>{title}</h3>
        
        <p style={{
          margin: '0 0 28px',
          fontSize: '14px',
          color: 'var(--muted)',
          lineHeight: 1.6,
        }}>{message}</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--muted)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            letterSpacing: '0.03em',
          }}>{cancelText}</button>
          
          <button onClick={onConfirm} style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: 'none',
            background: danger ? '#ef4444' : 'var(--gold)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.03em',
          }}>{confirmText}</button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
