import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ManageInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ scheduledAt: '', mode: 'online', location: '', message: '' });

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get('/interviews');
      setInterviews(data);
    } catch (error) {
      toast.error('Failed to load interviews');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const openEdit = (inv) => {
    setEditingId(inv._id);
    const d = new Date(inv.scheduledAt);
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; 
    const localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, 16);

    setFormData({
      scheduledAt: localISOTime,
      mode: inv.mode,
      location: inv.location || '',
      message: inv.message || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/interviews/${editingId}`, formData);
      toast.success('Interview updated');
      setShowModal(false);
      fetchInterviews();
    } catch (error) {
      toast.error('Failed to update interview');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await api.delete(`/interviews/${id}`);
        toast.success('Interview deleted');
        fetchInterviews();
      } catch (error) {
        toast.error('Failed to delete interview');
      }
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading interviews...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <h1 style={{ color: '#2d3748', marginBottom: '2rem' }}>Manage Interviews</h1>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>Candidate</th>
              <th style={{ padding: '1rem' }}>Job</th>
              <th style={{ padding: '1rem' }}>Date & Time</th>
              <th style={{ padding: '1rem' }}>Mode/Location</th>
              <th style={{ padding: '1rem', width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map(inv => (
              <tr key={inv._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '500' }}>{inv.application?.candidate?.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>{inv.application?.candidate?.email}</div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div>{inv.application?.job?.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>{inv.application?.job?.branch?.name}</div>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(inv.scheduledAt).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ textTransform: 'capitalize', fontWeight: '500' }}>{inv.mode}</div>
                  {inv.location && <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>{inv.location}</div>}
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: '#edf2f7' }} onClick={() => openEdit(inv)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(inv._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {interviews.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: '#718096' }}>No interviews scheduled.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0 }}>Edit Interview</h2>
            <form onSubmit={handleSubmit}>
              <label>Date & Time</label>
              <input type="datetime-local" className="input" required value={formData.scheduledAt} onChange={e => setFormData({...formData, scheduledAt: e.target.value})} />
              
              <label>Mode</label>
              <select className="input" value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})}>
                <option value="online">Online</option>
                <option value="onsite">Onsite</option>
              </select>

              <label>Location / Link</label>
              <input className="input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />

              <label>Message / Notes</label>
              <textarea className="input" rows="3" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn" style={{ backgroundColor: '#e2e8f0' }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageInterviews;