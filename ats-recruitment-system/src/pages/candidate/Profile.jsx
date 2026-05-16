import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';

const Profile = () => {
  useTitle('My Profile');
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '',
    education: user?.education || '',
    experience: user?.experience || ''
  });
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading('Uploading photo...');
    try {
      const data = new FormData();
      data.append('file', file);
      
      const response = await api.post('/upload/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser = { ...user, profileImage: response.data.url };
      updateUser(updatedUser);
      await api.put('/auth/me', { profileImage: response.data.url });
      
      toast.success('Photo updated!', { id: toastId });
    } catch (error) {
      toast.error('Failed to upload photo', { id: toastId });
    }
    setUploadingImage(false);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingResume(true);
    const toastId = toast.loading('Uploading Resume...');
    try {
      const data = new FormData();
      data.append('file', file);
      
      const response = await api.post('/upload/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser = { ...user, resumeUrl: response.data.url };
      updateUser(updatedUser);
      await api.put('/auth/me', { resumeUrl: response.data.url });
      
      toast.success('Resume updated!', { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload resume', { id: toastId });
    }
    setUploadingResume(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/me', formData);
      updateUser(data);
      toast.success('Profile saved');
    } catch (error) {
      toast.error('Failed to save profile');
    }
    setSaving(false);
  };

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '3rem', marginBottom: '4rem' }}>
      <div className="card" style={{ padding: '3rem' }}>
        <h1 className="gradient-text" style={{ marginTop: 0, marginBottom: '2rem', textAlign: 'center', fontSize: '2.5rem' }}>My Profile</h1>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', marginBottom: '3rem', justifyContent: 'center' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0, boxShadow: 'var(--glass-shadow)', border: '4px solid var(--primary-color)' }}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '3rem', fontWeight: 'bold' }}>
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <label className="btn btn-primary" style={{ cursor: uploadingImage ? 'wait' : 'pointer', padding: '0.8rem 1.5rem' }}>
              {uploadingImage ? 'Uploading...' : 'Change Photo'}
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>

          <div style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>My Resume (CV)</h3>
            {user?.resumeUrl ? (
              <a href={user.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'none' }}>📄 View Current Resume</a>
            ) : (
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No resume uploaded yet.</p>
            )}
            
            <label className="btn" style={{ cursor: uploadingResume ? 'wait' : 'pointer', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', textAlign: 'center', marginTop: '0.5rem' }}>
              {uploadingResume ? 'Uploading...' : 'Upload PDF Resume'}
              <input type="file" style={{ display: 'none' }} accept=".pdf" onChange={handleResumeUpload} disabled={uploadingResume} />
            </label>
          </div>

        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Email Address (Read-only)</label>
              <input className="input" type="email" value={user?.email || ''} disabled style={{ backgroundColor: 'var(--bg-main)', cursor: 'not-allowed', opacity: 0.7 }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Full Name</label>
              <input className="input" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Phone Number</label>
            <input className="input" type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. +1 234 567 8900" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Education History</label>
            <textarea className="input" rows="3" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} placeholder="e.g. BS Computer Science - University of Tech (2018-2022)"></textarea>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>Work Experience</label>
            <textarea className="input" rows="4" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} placeholder="e.g. Software Engineer at TechCorp (2022-Present)..."></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Profile;