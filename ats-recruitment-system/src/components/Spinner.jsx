import React from 'react';

const Spinner = ({ size = '40px', color = 'var(--primary-color)' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
    <div style={{
      width: size,
      height: size,
      border: `4px solid ${color}40`,
      borderTop: `4px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
);

export default Spinner;
