import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useTitle } from '../hooks/useTitle';

const Register = () => {
  useTitle('Register');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'candidate' });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(formData);
      if (formData.role === 'hr') {
        navigate('/admin');
      } else {
        navigate('/candidate');
      }
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '3rem', marginBottom: '3rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', marginTop: 0 }}>Register</h2>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: formData.role === 'candidate' ? 'bold' : 'normal', color: formData.role === 'candidate' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
              <input type="radio" name="role" value="candidate" checked={formData.role === 'candidate'} onChange={() => setFormData({...formData, role: 'candidate'})} style={{ cursor: 'pointer' }} />
              I'm a Candidate
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: formData.role === 'hr' ? 'bold' : 'normal', color: formData.role === 'hr' ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
              <input type="radio" name="role" value="hr" checked={formData.role === 'hr'} onChange={() => setFormData({...formData, role: 'hr'})} style={{ cursor: 'pointer' }} />
              I'm a Recruiter
            </label>
          </div>

          <label>Name</label>
          <input className={`input ${errors.name ? 'error' : ''}`} type="text" value={formData.name} onChange={e => {setFormData({...formData, name: e.target.value}); setErrors({...errors, name: null})}} />
          {errors.name && <span className="error-text">{errors.name}</span>}
          
          <label>Email</label>
          <input className={`input ${errors.email ? 'error' : ''}`} type="email" value={formData.email} onChange={e => {setFormData({...formData, email: e.target.value}); setErrors({...errors, email: null})}} />
          {errors.email && <span className="error-text">{errors.email}</span>}
          
          <label>Password</label>
          <input className={`input ${errors.password ? 'error' : ''}`} type="password" value={formData.password} onChange={e => {setFormData({...formData, password: e.target.value}); setErrors({...errors, password: null})}} />
          {errors.password && <span className="error-text">{errors.password}</span>}
          
          <label>Phone</label>
          <input className="input" type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Create Account</button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};
export default Register;