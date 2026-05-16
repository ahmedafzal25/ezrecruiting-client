import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job', error);
        toast.error('Failed to load job details');
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!user) {
      toast('Please login to apply', { icon: 'ℹ️' });
      navigate('/login');
      return;
    }
    
    if (user.role === 'admin' || user.role === 'hr') {
      toast.error('Only candidates can apply to jobs');
      return;
    }

    setShowApplyModal(true);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const { data } = await api.post('/upload/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data.url;
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Resume is required');
      return;
    }

    setUploading(true);
    try {
      toast.loading('Uploading files...', { id: 'apply' });
      
      const resumeUrl = await uploadFile(resumeFile);
      let coverLetterUrl = '';
      
      if (coverLetterFile) {
        coverLetterUrl = await uploadFile(coverLetterFile);
      }

      toast.loading('Submitting application...', { id: 'apply' });

      await api.post('/applications', {
        jobId: job._id,
        resumeUrl,
        coverLetterUrl
      });

      toast.success('Application submitted successfully!', { id: 'apply' });
      setShowApplyModal(false);
      setHasApplied(true);
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already applied')) {
        toast.error('You have already applied to this job.', { id: 'apply' });
        setHasApplied(true);
        setShowApplyModal(false);
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit application', { id: 'apply' });
      }
    }
    setUploading(false);
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading job details...</div>;
  if (!job) return <div className="container" style={{ marginTop: '2rem' }}>Job not found.</div>;

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2b6cb0', marginTop: 0 }}>{job.title}</h1>
        <p style={{ color: '#4a5568', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          <strong>{job.department}</strong> • {job.branch?.name} ({job.branch?.city})
        </p>
        
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '8px', flexWrap: 'wrap' }}>
          {job.salaryRange && (
            <div>
              <span style={{ color: '#718096', display: 'block', fontSize: '0.9rem' }}>Salary</span>
              <strong>{job.salaryRange}</strong>
            </div>
          )}
          <div>
            <span style={{ color: '#718096', display: 'block', fontSize: '0.9rem' }}>Openings</span>
            <strong>{job.seats}</strong>
          </div>
          <div>
            <span style={{ color: '#718096', display: 'block', fontSize: '0.9rem' }}>Status</span>
            <strong style={{ color: job.status === 'open' ? '#38a169' : '#e53e3e', textTransform: 'capitalize' }}>
              {job.status}
            </strong>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Job Description</h3>
          <p style={{ whiteSpace: 'pre-wrap', color: '#4a5568', lineHeight: '1.6' }}>{job.description}</p>
        </div>

        {job.requirements && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Requirements</h3>
            <p style={{ whiteSpace: 'pre-wrap', color: '#4a5568', lineHeight: '1.6' }}>{job.requirements}</p>
          </div>
        )}

        <div style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
          {hasApplied ? (
            <div style={{ padding: '1rem', backgroundColor: '#c6f6d5', color: '#22543d', borderRadius: '4px', textAlign: 'center' }}>
              You have already applied for this job. <Link to="/candidate/applications" style={{ color: '#276749', fontWeight: 'bold', marginLeft: '0.5rem' }}>View your applications</Link>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
              onClick={handleApplyClick}
              disabled={job.status !== 'open'}
            >
              {job.status === 'open' ? 'Apply Now' : 'Closed'}
            </button>
          )}
        </div>
      </div>

      {showApplyModal && (
        <div className="card" style={{ border: '2px solid #3182ce' }}>
          <h2 style={{ marginTop: 0 }}>Apply for {job.title}</h2>
          <form onSubmit={handleApplySubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Resume (PDF/DOCX) *</label>
              <input 
                type="file" 
                className="input" 
                accept=".pdf,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                required
                disabled={uploading}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Cover Letter (Optional)</label>
              <input 
                type="file" 
                className="input"
                accept=".pdf,.docx" 
                onChange={(e) => setCoverLetterFile(e.target.files[0])}
                disabled={uploading}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" disabled={uploading || !resumeFile}>
                {uploading ? 'Uploading & Submitting...' : 'Submit Application'}
              </button>
              <button 
                type="button" 
                className="btn" 
                style={{ backgroundColor: '#e2e8f0' }} 
                onClick={() => setShowApplyModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobDetails;