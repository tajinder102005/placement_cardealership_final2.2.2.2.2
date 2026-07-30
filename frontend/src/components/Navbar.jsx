import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <Car size={20} className="text-orange-500" />
          <span className="text-[15px] font-bold tracking-tight text-white">
            Torque <span className="text-orange-500">Motors</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/showroom" className="text-[13px] font-medium text-[#999] transition-colors duration-200 hover:text-white no-underline">
            Showroom
          </Link>
          <Link to="/purchases" className="text-[13px] font-medium text-[#999] transition-colors duration-200 hover:text-white no-underline">
            My purchases
          </Link>
          {isAdmin && (
            <Link to="/showroom" className="text-[13px] font-medium text-[#999] transition-colors duration-200 hover:text-white no-underline">
              Inventory
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <span className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/[0.08] px-2.5 py-1 text-[11px] font-bold text-orange-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Admin
                </span>
              )}
              <span className="hidden text-[13px] text-[#777] sm:inline">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-[#777] transition-colors duration-200 hover:bg-white/[0.04] hover:text-white"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-[#999] transition-colors duration-200 hover:text-white no-underline"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-orange-500 px-4 py-1.5 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-orange-600 no-underline"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
