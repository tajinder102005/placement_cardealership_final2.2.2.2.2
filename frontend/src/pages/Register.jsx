import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { User, Mail, Lock, UserPlus, Car } from 'lucide-react';

const inputClass = "w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] py-2.5 pl-10 pr-4 text-[13px] text-white placeholder-[#444] outline-none transition-colors duration-200 focus:border-orange-500/40";

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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-[#111] p-8">
          <div className="mb-8 flex items-center justify-center gap-2">
            <Car size={20} className="text-orange-500" />
            <span className="text-[15px] font-bold text-white">
              Torque <span className="text-orange-500">Motors</span>
            </span>
          </div>
          <h2 className="mb-1 text-center text-xl font-bold text-white">Create Account</h2>
          <p className="mb-8 text-center text-[13px] text-[#555]">Join the Torque Motors showroom</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
                Full Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              {errors.name && <p className="mt-1.5 text-[11px] text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              </div>
              {errors.email && <p className="mt-1.5 text-[11px] text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#555]">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
              </div>
              {errors.password && <p className="mt-1.5 text-[11px] text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-orange-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : <><UserPlus size={14} /> Sign Up</>}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#555]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-orange-400 no-underline transition-colors duration-200 hover:text-orange-300">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
