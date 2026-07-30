import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Save } from 'lucide-react';
import './AuthStyles.css';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!token) {
      toast.error('Reset token is missing from URL.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword(token, password);
      toast.success(response.message || 'Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="authContainer">
      <div className="authCard">
        <h2 className="authTitle">New Password</h2>
        <p className="authSubtitle">Create a secure password for your account</p>
        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="formLabel">New Password</label>
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

          <div className="formGroup">
            <label className="formLabel">Confirm Password</label>
            <div className="inputWrapper">
              <Lock className="inputIcon" />
              <input
                type="password"
                className="formInput"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && <p className="errorText">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="authButton" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : (
              <>
                <Save size={18} />
                Reset Password
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

export default ResetPassword;
