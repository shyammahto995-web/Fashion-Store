import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../../components/BrandLogo';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { adminLogin, isAdminLoggedIn } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      onNavigate('/admin/dashboard');
    }
  }, [isAdminLoggedIn, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await adminLogin(email, password);
    if (res.success) {
      onNavigate('/admin/dashboard');
    } else {
      setError(res.error || 'Invalid admin credentials. Please try again.');
    }
  };

  return (
    <div id="admin-login-page" className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo variant="horizontal" theme="dark" size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-[#C59B51]" />
            <span>Staff &amp; Admin Portal</span>
          </div>
          <h1 className="text-xl font-bold font-serif-luxury text-[#0B132B]">
            Store Administration Login
          </h1>
          <p className="text-xs text-stone-500">
            Sign in with authorized administrator credentials to manage products, orders, customers, and store analytics.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Admin User ID / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoComplete="username"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <span>SIGN IN TO DASHBOARD</span>
            <ArrowRight className="w-4 h-4 text-[#E5C384]" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs font-semibold text-stone-500 hover:text-stone-900 underline"
          >
            ← Back to Storefront
          </button>
        </div>

      </div>
    </div>
  );
};
