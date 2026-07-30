import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Key } from 'lucide-react';
import './AuthStyles.css';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is invalid';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await forgotPassword(email);
      toast.success(response.message || 'Verification link sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to request reset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2 className="authTitle">Recover Password</h2>
        <p className="authSubtitle">We will send you a reset link if the email matches</p>
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="authButton" disabled={isSubmitting}>
            {isSubmitting ? 'Sending Link...' : (
              <>
                <Key size={18} />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="authFooter">
          Remember your password?{' '}
          <Link to="/login" className="footerLink">
            Go back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
