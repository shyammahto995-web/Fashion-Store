import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Check, ShieldCheck, Save, KeyRound, UserCheck, Lock, AlertCircle } from 'lucide-react';

export const AdminSettingsTab: React.FC = () => {
  const { settings, updateSettings, addToast, adminEmail, updateAdminCredentials } = useStore();

  // Store Settings
  const [storeName, setStoreName] = useState(settings.storeName);
  const [storeEmail, setStoreEmail] = useState(settings.storeEmail);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress);
  const [currency, setCurrency] = useState(settings.currency);

  // Admin Credentials Change State
  const [newAdminEmail, setNewAdminEmail] = useState(adminEmail || 'shyammahto995@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credError, setCredError] = useState('');
  const [credSuccess, setCredSuccess] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      storeName,
      storeEmail,
      supportPhone,
      storeAddress,
      currency,
    });
    addToast('Store settings updated successfully!', 'success');
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredError('');
    setCredSuccess('');

    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      setCredError('Please provide a valid email address for Admin User ID.');
      return;
    }
    if (!newPassword) {
      setCredError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setCredError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setCredError('Passwords do not match. Please re-type identical passwords.');
      return;
    }

    const res = await updateAdminCredentials(newAdminEmail.trim(), newPassword.trim());
    if (res.success) {
      setCredSuccess('Admin User ID and Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setCredError(res.error || 'Failed to update admin credentials.');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      
      <div>
        <h1 className="text-2xl font-bold font-serif-luxury text-[#0B132B]">
          Store &amp; Security Settings
        </h1>
        <p className="text-xs text-stone-500">
          Modify store contact information, address details, and update your administrator login credentials.
        </p>
      </div>

      {/* Card 1: Change Admin User ID & Password (Requested by User) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-[#C59B51]/30 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
          <div className="w-9 h-9 rounded-lg bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#0B132B]">
              Change Admin User ID &amp; Password
            </h2>
            <p className="text-xs text-stone-500">
              Update the master credentials used to sign in to this administrator dashboard.
            </p>
          </div>
        </div>

        {credError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{credError}</span>
          </div>
        )}

        {credSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{credSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Admin User ID (Email Address)
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
                placeholder="shyammahto995@gmail.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
              />
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              This email will be required on the Admin Login page.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                New Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#E5C384]" />
              <span>UPDATE ADMIN CREDENTIALS</span>
            </button>
          </div>
        </form>
      </div>

      {/* Card 2: Storefront Configurations */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-xl border border-stone-200 shadow-2xs space-y-6">
        
        <div className="pb-3 border-b border-stone-200">
          <h2 className="text-base font-bold text-[#0B132B]">
            Public Storefront Information
          </h2>
          <p className="text-xs text-stone-500">
            Contact phone numbers and addresses shown to customers on the website footer and contact pages.
          </p>
        </div>

        {/* Brand Name */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Storefront Brand Name
          </label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
          />
        </div>

        {/* Store Address */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Store Physical / Headquarters Address
          </label>
          <input
            type="text"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
          />
        </div>

        {/* Support Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Customer Support Phone
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Customer Support Email
            </label>
            <input
              type="email"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
            />
          </div>
        </div>

        {/* Currency Format */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Currency Symbol
          </label>
          <input
            type="text"
            value={currency}
            disabled
            className="w-32 px-3.5 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm font-bold text-stone-500"
          />
          <span className="text-[11px] text-stone-400 mt-1 block">
            Indian Rupee (₹) is fixed per store specification.
          </span>
        </div>

        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors"
          >
            <Save className="w-4 h-4 text-[#E5C384]" />
            <span>SAVE STORE SETTINGS</span>
          </button>
        </div>

      </form>

    </div>
  );
};
