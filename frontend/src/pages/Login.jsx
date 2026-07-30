import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';
import './AuthStyles.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email is invalid';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2 className="authTitle">Welcome Back</h2>
        <p className="authSubtitle">Sign in to access the showroom</p>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="formLabel">Email Address</label>
            <div className="inputWrapper">
              <Mail className="inputIcon" />
              <input type="email" className="formInput" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {errors.email && <p className="errorText">{errors.email}</p>}
          </div>
          <div className="formGroup">
            <label className="formLabel">Password</label>
            <div className="inputWrapper">
              <Lock className="inputIcon" />
              <input type="password" className="formInput" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {errors.password && <p className="errorText">{errors.password}</p>}
            <Link to="/forgot-password" className="forgotPasswordLink">Forgot Password?</Link>
          </div>
          <button type="submit" className="authButton" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>
        <div className="authFooter">
          Don't have an account? <Link to="/register" className="footerLink">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
