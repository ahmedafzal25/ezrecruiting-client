import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useTitle } from '../hooks/useTitle';

const Login = () => {
  useTitle('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const userData = await login(email, password);
      if (userData.role === 'admin' || userData.role === 'hr') navigate('/admin');
      else navigate('/candidate');
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '3rem', marginBottom: '3rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', marginTop: 0 }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input className={`input ${errors.email ? 'error' : ''}`} type="email" value={email} onChange={e => {setEmail(e.target.value); setErrors({...errors, email: null})}} />
          {errors.email && <span className="error-text">{errors.email}</span>}
          
          <label>Password</label>
          <input className={`input ${errors.password ? 'error' : ''}`} type="password" value={password} onChange={e => {setPassword(e.target.value); setErrors({...errors, password: null})}} />
          {errors.password && <span className="error-text">{errors.password}</span>}
          
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/register" style={{ color: 'var(--text-secondary)' }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
};
export default Login;