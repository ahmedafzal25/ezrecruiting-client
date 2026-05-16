import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.25rem' }}>{job.title}</h3>
          <span style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--primary-color)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600' }}>
            {job.department}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
          <span>📍</span> {job.branch?.name || 'Remote'}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          <span>💰</span> {job.salaryRange || 'Competitive'}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <span>👥</span> {job.seats} Open {job.seats === 1 ? 'Position' : 'Positions'}
        </div>
      </div>
      
      <Link to={`/jobs/${job._id}`} className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
        View & Apply
      </Link>
    </div>
  );
};

export default JobCard;
