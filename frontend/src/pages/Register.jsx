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
    const tempErrors = {};
    if (!name) {
      tempErrors.name = 'Name is required';
    } else if (name.length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
    }
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is invalid';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await register(name, email, password);
      toast.success(response.message || 'Registration successful! Check your email.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2 className="authTitle">Create Account</h2>
        <p className="authSubtitle">Join us to secure your access</p>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="formLabel">Full Name</label>
            <div className="inputWrapper">
              <User className="inputIcon" />
              <input
                type="text"
                className="formInput"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && <p className="errorText">{errors.name}</p>}
          </div>

          <div className="formGroup">
            <label className="formLabel">Email Address</label>
            <div className="inputWrapper">
              <Mail className="inputIcon" />
              <input
                type="email"
                className="formInput"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="errorText">{errors.email}</p>}
          </div>

          <div className="formGroup">
            <label className="formLabel">Password</label>
            <div className="inputWrapper">
              <Lock className="inputIcon" />
              <input
                type="password"
                className="formInput"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && <p className="errorText">{errors.password}</p>}
          </div>

          <button type="submit" className="authButton" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : (
              <>
                <UserPlus size={18} />
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="authFooter">
          Already have an account?{' '}
          <Link to="/login" className="footerLink">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
