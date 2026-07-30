import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import './AuthStyles.css';

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('failed');
        return;
      }
      try {
        await verifyEmail(token);
        setStatus('success');
        toast.success('Email verified successfully!');
      } catch (err) {
        setStatus('failed');
        toast.error(err.message || 'Verification failed.');
      }
    };
    performVerification();
  }, [token]);

  return (
    <div className="authContainer">
      <div className="authCard" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <ShieldCheck size={48} className="authTitle" style={{ color: 'var(--accent-color)', margin: '0 auto 20px' }} />
            <h2 className="authTitle">Verifying Email</h2>
            <p className="authSubtitle">Confirming your security token...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 size={48} style={{ color: 'var(--success-color)', margin: '0 auto 20px' }} />
            <h2 className="authTitle">Account Verified</h2>
            <p className="authSubtitle">Your email has been verified successfully!</p>
            <button className="authButton" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircle size={48} style={{ color: 'var(--error-color)', margin: '0 auto 20px' }} />
            <h2 className="authTitle">Verification Failed</h2>
            <p className="authSubtitle">The link is invalid or has expired.</p>
            <Link to="/login" className="authButton" style={{ display: 'inline-flex' }}>
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
