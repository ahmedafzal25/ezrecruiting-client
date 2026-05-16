import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', isDanger = false }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="card modal-content" style={{ maxWidth: '400px' }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} onClick={onCancel}>Cancel</button>
          <button className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal;
