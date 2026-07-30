import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import './AuthStyles.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!name || name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const res = await register(name, email, password);
      toast.success(res.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2 className="authTitle">Create Account</h2>
        <p className="authSubtitle">Join the AutoDrive Showroom</p>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="formLabel">Full Name</label>
            <div className="inputWrapper">
              <User className="inputIcon" />
              <input type="text" className="formInput" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
            </div>
            {errors.name && <p className="errorText">{errors.name}</p>}
          </div>
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
          </div>
          <button type="submit" className="authButton" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>
        <div className="authFooter">
          Already have an account? <Link to="/login" className="footerLink">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
