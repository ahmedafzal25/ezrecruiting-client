import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';
import Spinner from '../../components/Spinner';
import ConfirmModal from '../../components/ConfirmModal';

const ManageJobs = () => {
  useTitle('Manage Jobs');
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Confirm Modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const initialForm = { title: '', department: '', description: '', requirements: '', salaryRange: '', seats: 1, branch: '', status: 'open' };
  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      const [jobsRes, branchRes] = await Promise.all([
        api.get('/jobs?all=true'),
        api.get('/branches')
      ]);
      setJobs(jobsRes.data);
      setBranches(branchRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openForm = (job = null) => {
    if (job) {
      setEditingId(job._id);
      setFormData({
        title: job.title,
        department: job.department,
        description: job.description,
        requirements: job.requirements,
        salaryRange: job.salaryRange,
        seats: job.seats,
        branch: job.branch?._id || '',
        status: job.status
      });
    } else {
      setEditingId(null);
      setFormData({ ...initialForm, branch: branches[0]?._id || '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/jobs/${editingId}`, formData);
        toast.success('Job updated');
      } else {
        await api.post('/jobs', formData);
        toast.success('Job created');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  const confirmDelete = (id) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/${deletingId}`);
      toast.success('Job deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete job');
    }
    setIsConfirmOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text-primary)', margin: 0 }}>Manage Jobs</h1>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Add Job</button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Department</th>
              <th style={{ padding: '1rem' }}>Branch</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{job.title}</td>
                <td style={{ padding: '1rem' }}>{job.department}</td>
                <td style={{ padding: '1rem' }}>{job.branch?.name}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.875rem', 
                    backgroundColor: job.status === 'open' ? '#c6f6d5' : '#fed7d7', 
                    color: job.status === 'open' ? '#22543d' : '#c53030' 
                  }}>
                    {job.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} onClick={() => openForm(job)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => confirmDelete(job._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No jobs found. Click "+ Add Job" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="card modal-content" style={{ maxWidth: '800px' }}>
            <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Job' : 'Add Job'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label>Title <span style={{color: 'var(--danger-color)'}}>*</span></label>
                  <input className="input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div>
                  <label>Department <span style={{color: 'var(--danger-color)'}}>*</span></label>
                  <input className="input" required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                </div>
                <div>
                  <label>Branch <span style={{color: 'var(--danger-color)'}}>*</span></label>
                  <select className="input" required value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})}>
                    <option value="">Select Branch</option>
                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label>Status</label>
                  <select className="input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label>Salary Range</label>
                  <input className="input" placeholder="e.g. $80k - $100k" value={formData.salaryRange} onChange={e => setFormData({...formData, salaryRange: e.target.value})} />
                </div>
                <div>
                  <label>Seats <span style={{color: 'var(--danger-color)'}}>*</span></label>
                  <input className="input" type="number" min="1" required value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} />
                </div>
              </div>
              
              <label>Description <span style={{color: 'var(--danger-color)'}}>*</span></label>
              <textarea className="input" rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              
              <label>Requirements</label>
              <textarea className="input" rows="4" value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})}></textarea>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isDanger={true}
        confirmText="Delete"
      />
    </div>
  );
};
export default ManageJobs;