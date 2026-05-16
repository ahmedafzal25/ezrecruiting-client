import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { useTitle } from '../../hooks/useTitle';

const StatusBadge = ({ status }) => {
  const colors = {
    'Submitted': { bg: '#e2e8f0', color: '#4a5568' },
    'Under Review': { bg: '#ebf8ff', color: '#2b6cb0' },
    'Shortlisted': { bg: '#faf089', color: '#744210' },
    'Interview Scheduled': { bg: '#faf5ff', color: '#6b46c1' },
    'Rejected': { bg: '#fed7d7', color: '#c53030' },
    'Selected': { bg: '#c6f6d5', color: '#22543d' },
  };
  const style = colors[status] || { bg: '#e2e8f0', color: '#4a5568' };
  return (
    <span style={{ backgroundColor: style.bg, color: style.color, padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
      {status}
    </span>
  );
};

const MyApplications = () => {
  useTitle('My Applications');
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, intRes] = await Promise.all([
          api.get('/applications/me'),
          api.get('/interviews/me')
        ]);
        setApplications(appRes.data);
        setInterviews(intRes.data);
      } catch (error) {}
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {interviews.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>Upcoming Interviews</h2>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {interviews.map(inv => (
              <div key={inv._id} className="card" style={{ borderLeft: '4px solid #6b46c1', padding: '1.5rem' }}>
                <h3 style={{ marginTop: 0, color: 'var(--primary-color)' }}>{inv.application?.job?.title}</h3>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-secondary)' }}>{inv.application?.job?.branch?.name}</p>
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '4px', marginTop: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem' }}><strong>Date:</strong> {new Date(inv.scheduledAt).toLocaleString()}</p>
                  <p style={{ margin: '0 0 0.5rem' }}><strong>Mode:</strong> <span style={{ textTransform: 'capitalize' }}>{inv.mode}</span></p>
                  {inv.location && <p style={{ margin: '0 0 0.5rem' }}><strong>Location:</strong> {inv.location}</p>}
                  {inv.message && <p style={{ margin: '0', whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{inv.message}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ color: 'var(--text-primary)', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h3 style={{ marginTop: 0 }}>No applications yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Browse our open positions to get started.</p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>Browse Jobs</Link>
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Job Title</th>
                <th style={{ padding: '1rem' }}>Branch</th>
                <th style={{ padding: '1rem' }}>Applied On</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Resume</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--text-primary)' }}>{app.job?.title}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{app.job?.branch?.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}><StatusBadge status={app.status} /></td>
                  <td style={{ padding: '1rem' }}>
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>View Resume</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default MyApplications;