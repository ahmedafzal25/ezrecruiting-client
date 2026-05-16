import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav style={{ 
      padding: '1rem 2rem', 
      borderBottom: '1px solid var(--border-color)', 
      backgroundColor: 'var(--bg-card)', 
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--glass-shadow)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
            E
          </div>
          <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>Ez Recruiting</span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</button>
          
          <div className={`nav-menu ${isOpen ? 'open' : ''}`}>
            <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link to="/" className="nav-link">Home</Link>
            
            {!user && (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>Register</Link>
              </>
            )}

            {user && user.role === 'candidate' && (
              <>
                <Link to="/candidate" className="nav-link">Dashboard</Link>
                <Link to="/candidate/applications" className="nav-link">Applications</Link>
                <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>Logout</button>
              </>
            )}

            {user && (user.role === 'admin' || user.role === 'hr') && (
              <>
                <Link to="/admin" className="nav-link">Dashboard</Link>
                <Link to="/admin/jobs" className="nav-link">Jobs</Link>
                <Link to="/admin/applicants" className="nav-link">Applicants</Link>
                <Link to="/admin/interviews" className="nav-link">Interviews</Link>
                <Link to="/admin/branches" className="nav-link">Branches</Link>
                <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
