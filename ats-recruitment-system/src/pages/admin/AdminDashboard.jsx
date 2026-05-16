import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useTitle } from '../../hooks/useTitle';
import Spinner from '../../components/Spinner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const AdminDashboard = () => {
  useTitle('Admin Dashboard');
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalJobs: 0,
    openJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    interviewsThisWeek: 0,
  });
  
  const [chartData, setChartData] = useState({
    statusData: [],
    branchData: [],
    timelineData: []
  });
  
  const [loading, setLoading] = useState(true);

  const STATUS_COLORS = {
    'Submitted': '#e2e8f0',
    'Under Review': '#3182ce',
    'Shortlisted': '#d69e2e',
    'Interview Scheduled': '#805ad5',
    'Rejected': '#e53e3e',
    'Selected': '#38a169'
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsRes, appsRes, intRes] = await Promise.all([
          api.get('/jobs?all=true'),
          api.get('/applications'),
          api.get('/interviews')
        ]);

        const jobs = jobsRes.data;
        const apps = appsRes.data;
        const interviews = intRes.data;

        // Count basic stats
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const upcomingInterviews = interviews.filter(i => {
          const d = new Date(i.scheduledAt);
          return d >= now && d <= nextWeek;
        });

        setStats({
          totalJobs: jobs.length,
          openJobs: jobs.filter(j => j.status === 'open').length,
          totalApplications: apps.length,
          pendingApplications: apps.filter(a => ['Submitted', 'Under Review'].includes(a.status)).length,
          interviewsThisWeek: upcomingInterviews.length,
        });

        // Compute Chart Data
        
        // 1. Applications by Status
        const statusCounts = {};
        apps.forEach(app => {
          statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });
        const statusData = Object.keys(statusCounts).map(key => ({
          name: key,
          value: statusCounts[key],
          color: STATUS_COLORS[key] || '#718096'
        }));

        // 2. Applications by Branch
        const branchCounts = {};
        apps.forEach(app => {
          const bName = app.job?.branch?.name || 'Unknown';
          branchCounts[bName] = (branchCounts[bName] || 0) + 1;
        });
        const branchData = Object.keys(branchCounts).map(key => ({
          name: key,
          applications: branchCounts[key]
        }));

        // 3. Applications over last 14 days
        const timelineObj = {};
        for (let i = 13; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          timelineObj[dateStr] = 0;
        }
        
        apps.forEach(app => {
          const appDateStr = new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          if (timelineObj[appDateStr] !== undefined) {
            timelineObj[appDateStr]++;
          }
        });
        const timelineData = Object.keys(timelineObj).map(key => ({
          date: key,
          applications: timelineObj[key]
        }));

        setChartData({
          statusData,
          branchData,
          timelineData
        });

      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '4rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        {user?.role === 'admin' ? 'System Admin Portal' : 'Recruiter Portal'}
      </h1>
      
      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Total Jobs</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: 'var(--primary-color)' }}>{stats.totalJobs}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Open Jobs</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#38a169' }}>{stats.openJobs}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Total Applications</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#805ad5' }}>{stats.totalApplications}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Pending Review</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: '#d69e2e' }}>{stats.pendingApplications}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>Interviews (7 Days)</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0', color: 'var(--danger-color)' }}>{stats.interviewsThisWeek}</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Status Pie Chart */}
        <div className="card">
          <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Applications by Status</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData.statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" nameKey="name" label>
                  {chartData.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Bar Chart */}
        <div className="card">
          <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Applications by Branch</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.branchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="applications" fill="var(--primary-color)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Line Chart */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Applications Over Time (Last 14 Days)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="#805ad5" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <Link to="/admin/jobs" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', border: '1px solid var(--border-color)', transition: 'transform 0.2s' }}>
          <h2 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Manage Jobs</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Create and update job postings</p>
        </Link>
        <Link to="/admin/applicants" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Manage Applicants</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Review applications and send emails</p>
        </Link>
        <Link to="/admin/interviews" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Manage Interviews</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Schedule and update interviews</p>
        </Link>
        <Link to="/admin/branches" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <h2 style={{ color: 'var(--primary-color)', marginTop: 0 }}>Manage Branches</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>Add or update branch locations</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;