import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { useTitle } from '../../hooks/useTitle';
import Spinner from '../../components/Spinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CandidateDashboard = () => {
  useTitle('Candidate Dashboard');
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, inProgress: 0, selected: 0 });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  const STATUS_COLORS = {
    'Submitted': '#e2e8f0',
    'Under Review': '#3182ce',
    'Shortlisted': '#d69e2e',
    'Interview Scheduled': '#805ad5',
    'Rejected': '#e53e3e',
    'Selected': '#38a169'
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/me');
        const total = data.length;
        const inProgress = data.filter(a => ['Under Review', 'Shortlisted', 'Interview Scheduled'].includes(a.status)).length;
        const selected = data.filter(a => a.status === 'Selected').length;
        setStats({ total, inProgress, selected });

        // Chart Data
        const statusCounts = {};
        data.forEach(app => {
          statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        const cData = Object.keys(statusCounts).map(key => ({
          name: key,
          value: statusCounts[key],
          color: STATUS_COLORS[key] || '#718096'
        }));
        setChartData(cData);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold', overflow: 'hidden', boxShadow: 'var(--glass-shadow)' }}>
          {user?.profileImage ? <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="gradient-text" style={{ margin: 0, fontSize: '2.5rem' }}>Welcome back, {user?.name}</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Candidate Portal</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>Total Applications</h3>
          <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0.5rem 0 0', color: 'var(--primary-color)' }}>{stats.total}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>In Progress</h3>
          <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0.5rem 0 0', color: 'var(--accent-color)' }}>{stats.inProgress}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)' }}>Selected</h3>
          <p style={{ fontSize: '3rem', fontWeight: '800', margin: '0.5rem 0 0', color: 'var(--primary-color)' }}>{stats.selected}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {chartData.length > 0 && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Application Status Breakdown</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={5} dataKey="value" nameKey="name" label>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
          <Link to="/candidate/profile" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>👤</div>
            <div>
              <h2 style={{ color: 'var(--primary-color)', margin: '0 0 0.25rem' }}>Edit Profile</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Update your personal details and photo</p>
            </div>
          </Link>
          <Link to="/" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>🔍</div>
            <div>
              <h2 style={{ color: 'var(--primary-color)', margin: '0 0 0.25rem' }}>Browse Jobs</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Find your next opportunity</p>
            </div>
          </Link>
          <Link to="/candidate/applications" className="card card-hover" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>📄</div>
            <div>
              <h2 style={{ color: 'var(--primary-color)', margin: '0 0 0.25rem' }}>My Applications</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Track your application statuses</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default CandidateDashboard;