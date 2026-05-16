import React from 'react';

const Footer = () => (
  <footer style={{ backgroundColor: 'var(--bg-card)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-color)', padding: '2rem 1rem', marginTop: 'auto', textAlign: 'center' }}>
    <div className="container" style={{ padding: 0 }}>
      <h2 className="gradient-text" style={{ margin: '0 0 1rem 0', fontFamily: 'var(--font-heading)' }}>Ez Recruiting</h2>
      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>&copy; {new Date().getFullYear()} Ez Recruiting. All rights reserved.</p>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>Built by: Ahmed Afzal</p>
    </div>
  </footer>
);
export default Footer;
