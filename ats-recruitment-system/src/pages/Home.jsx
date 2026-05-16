import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import { useTitle } from '../hooks/useTitle';

const Home = () => {
  useTitle('Careers');
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/jobs', {
        params: { q, branch, department }
      });
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs', error);
    }
    setLoading(false);
  };

  const fetchBranches = async () => {
    try {
      const { data } = await api.get('/branches');
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches', error);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const resetFilters = () => {
    setQ('');
    setBranch('');
    setDepartment('');
    setTimeout(() => {
      fetchJobs();
    }, 0);
  };

  return (
    <div style={{ marginBottom: '4rem' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '6rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '600px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
          <img src="/hero.png" alt="Futuristic Recruiting" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, var(--bg-main))' }}></div>
        </div>

        <div className="container" style={{ textAlign: 'center', animation: 'slideUp 0.6s ease-out' }}>
          <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>Find Your Dream Job<br/>With Ez Recruiting</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-primary)', maxWidth: '600px', margin: '0 auto 3rem', backdropFilter: 'blur(4px)', padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)', boxShadow: 'var(--glass-shadow)' }}>
            Join the future of talent acquisition. We connect the brightest minds with the most innovative companies globally.
          </p>
          
          <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Search keywords..." 
                className="input" 
                style={{ width: 'auto', flex: '1', minWidth: '200px', marginBottom: 0 }}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <select 
                className="input" 
                style={{ width: 'auto', flex: '1', minWidth: '150px', marginBottom: 0 }}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">All Branches</option>
                {branches.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Department..." 
                className="input" 
                style={{ width: 'auto', flex: '1', minWidth: '150px', marginBottom: 0 }}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Search</button>
            </form>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="container" style={{ margin: '4rem auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <img src="/about.png" alt="About Ez Recruiting" style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--glass-shadow)', animation: 'float 6s ease-in-out infinite' }} />
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Empowering Your Career</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              At Ez Recruiting, we believe in the power of potential. Our cutting-edge platform seamlessly matches your unique skills with the perfect organizational culture. We aren't just an ATS; we are your dedicated career partners.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1rem' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--primary-color)', margin: 0 }}>98%</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Placement Rate</p>
              </div>
              <div className="card" style={{ flex: 1, textAlign: 'center', padding: '1rem' }}>
                <h3 style={{ fontSize: '2rem', color: 'var(--accent-color)', margin: 0 }}>24hr</h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Average Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="container" style={{ marginTop: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '3rem', fontFamily: 'var(--font-heading)' }}>Open Positions</h2>
        
        {loading ? (
          <Spinner size="50px" />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {jobs.length > 0 ? (
              jobs.map(job => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem' }}>
                <h2 style={{ margin: '0 0 1rem', color: 'var(--text-primary)' }}>No jobs found</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>We couldn't find any open positions matching your search criteria.</p>
                <button className="btn btn-primary" onClick={resetFilters}>Clear Filters</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;