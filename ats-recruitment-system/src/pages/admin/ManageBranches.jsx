import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', city: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchBranches = async () => {
    try {
      const { data } = await api.get('/branches');
      setBranches(data);
    } catch (error) {
      toast.error('Failed to load branches');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/branches/${editingId}`, formData);
        toast.success('Branch updated');
      } else {
        await api.post('/branches', formData);
        toast.success('Branch created');
      }
      setShowModal(false);
      fetchBranches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save branch');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await api.delete(`/branches/${id}`);
        toast.success('Branch deleted');
        fetchBranches();
      } catch (error) {
        toast.error('Failed to delete branch');
      }
    }
  };

  const openForm = (branch = null) => {
    if (branch) {
      setEditingId(branch._id);
      setFormData({ name: branch.name, city: branch.city, address: branch.address });
    } else {
      setEditingId(null);
      setFormData({ name: '', city: '', address: '' });
    }
    setShowModal(true);
  };

  if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading branches...</div>;

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#2d3748', margin: 0 }}>Manage Branches</h1>
        <button className="btn btn-primary" onClick={() => openForm()}>+ Add Branch</button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>City</th>
              <th style={{ padding: '1rem' }}>Address</th>
              <th style={{ padding: '1rem', width: '150px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{branch.name}</td>
                <td style={{ padding: '1rem' }}>{branch.city}</td>
                <td style={{ padding: '1rem' }}>{branch.address}</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn" style={{ padding: '0.25rem 0.5rem', backgroundColor: '#edf2f7' }} onClick={() => openForm(branch)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleDelete(branch._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {branches.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#718096' }}>No branches found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Branch' : 'Add Branch'}</h2>
            <form onSubmit={handleSubmit}>
              <label>Name</label>
              <input className="input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              
              <label>City</label>
              <input className="input" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
              
              <label>Address</label>
              <input className="input" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn" style={{ backgroundColor: '#e2e8f0' }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageBranches;