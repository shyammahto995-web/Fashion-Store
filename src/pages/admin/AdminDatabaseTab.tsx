import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  SUPABASE_PROJECT_ID, 
  SUPABASE_URL, 
  SUPABASE_SETUP_SQL 
} from '../../lib/supabase';
import { 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  UploadCloud, 
  DownloadCloud, 
  ShieldCheck, 
  Layers, 
  ShoppingBag,
  PackageCheck,
  Code
} from 'lucide-react';

export const AdminDatabaseTab: React.FC = () => {
  const { 
    orders, 
    products, 
    supabaseStatus, 
    isSupabaseSyncing, 
    refreshSupabaseData, 
    syncProductsToSupabase, 
    syncOrdersToSupabase,
    addToast 
  } = useStore();

  const [copied, setCopied] = useState(false);
  const [activeSyncAction, setActiveSyncAction] = useState<string | null>(null);

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
      setCopied(true);
      addToast('Supabase SQL setup script copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      addToast('Failed to copy. Please manually select the code below.', 'error');
    }
  };

  const handleSyncProducts = async () => {
    setActiveSyncAction('products');
    const res = await syncProductsToSupabase();
    setActiveSyncAction(null);
    if (!res.success) {
      addToast(
        res.error?.includes('relation') || res.error?.includes('PGRST205')
          ? 'Table "products" not found in Supabase! Please run the SQL script below in your Supabase SQL editor.'
          : `Sync error: ${res.error}`,
        'error'
      );
    }
  };

  const handleSyncOrders = async () => {
    setActiveSyncAction('orders');
    const res = await syncOrdersToSupabase();
    setActiveSyncAction(null);
    if (!res.success) {
      addToast(
        res.error?.includes('relation') || res.error?.includes('PGRST205')
          ? 'Table "orders" not found in Supabase! Please run the SQL script below in your Supabase SQL editor.'
          : `Sync error: ${res.error}`,
        'error'
      );
    }
  };

  const handleTestConnection = async () => {
    setActiveSyncAction('test');
    await refreshSupabaseData();
    setActiveSyncAction(null);
    addToast('Supabase connection re-checked!', 'info');
  };

  return (
    <div id="admin-database-tab" className="space-y-6 max-w-6xl mx-auto">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#0B132B] text-[#E5C384]">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold font-serif-luxury text-[#0B132B]">
                Supabase Cloud Database
              </h1>
              <p className="text-xs text-stone-500">
                Connected Project: <span className="font-semibold text-stone-800">Fashion Store deta base</span> ({SUPABASE_PROJECT_ID})
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTestConnection}
            disabled={isSupabaseSyncing || activeSyncAction !== null}
            className="inline-flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSupabaseSyncing ? 'animate-spin' : ''}`} />
            <span>Check Connection</span>
          </button>

          <a
            href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#0B132B] hover:bg-[#152347] text-white text-xs font-bold rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E5C384]" />
            <span>Open Supabase SQL Editor</span>
          </a>
        </div>
      </div>

      {/* Connection & Configuration Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Project Card */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Connection</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              supabaseStatus.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus.isConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              {supabaseStatus.isConnected ? 'Server Online' : 'Connecting'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-stone-500">Endpoint:</div>
            <div className="text-xs font-mono bg-stone-50 px-2 py-1.5 rounded border border-stone-100 truncate text-stone-800" title={SUPABASE_URL}>
              {SUPABASE_URL}
            </div>
            <div className="text-[11px] text-stone-400 pt-1">
              Project ID: <span className="font-mono text-stone-700">{SUPABASE_PROJECT_ID}</span>
            </div>
          </div>
        </div>

        {/* Orders Table Status */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#C59B51]" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">public.orders</span>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              supabaseStatus.ordersTableExists ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {supabaseStatus.ordersTableExists ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Table Ready</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Needs SQL Setup</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            Stores customer orders, mobile, address, items, amounts, and statuses.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-xs text-stone-500">Total in Store: <strong className="text-stone-800">{orders.length}</strong></span>
            <button
              onClick={handleSyncOrders}
              disabled={isSupabaseSyncing || activeSyncAction !== null}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-bold transition-colors disabled:opacity-50"
            >
              <UploadCloud className="w-3 h-3 text-stone-600" />
              <span>Sync Orders</span>
            </button>
          </div>
        </div>

        {/* Products Table Status */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-[#C59B51]" />
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800">public.products</span>
            </div>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              supabaseStatus.productsTableExists ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {supabaseStatus.productsTableExists ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Table Ready</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Needs SQL Setup</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            Stores products with multiple image URLs, price, stock, category & details.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <span className="text-xs text-stone-500">Total in Store: <strong className="text-stone-800">{products.length}</strong></span>
            <button
              onClick={handleSyncProducts}
              disabled={isSupabaseSyncing || activeSyncAction !== null}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-bold transition-colors disabled:opacity-50"
            >
              <UploadCloud className="w-3 h-3 text-stone-600" />
              <span>Sync Products</span>
            </button>
          </div>
        </div>
      </div>

      {/* SQL Setup Helper Section */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 bg-stone-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#0B132B]" />
                <h2 className="text-base font-bold text-[#0B132B]">
                  Supabase Database Setup (One-Click SQL Script)
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Agar Supabase me <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800 font-mono">orders</code> aur <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800 font-mono">products</code> tables create nahi hain, to bas niche diya gaya script Supabase SQL Editor me paste karke <strong>Run</strong> karein.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySQL}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C59B51] hover:bg-[#b0873f] text-[#0B132B] font-bold text-xs rounded-lg shadow-xs transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>

              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}/sql/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0B132B] hover:bg-[#162348] text-white font-bold text-xs rounded-lg shadow-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#E5C384]" />
                <span>Open SQL Editor</span>
              </a>
            </div>
          </div>
        </div>

        {/* Instructions Steps */}
        <div className="p-6 bg-stone-50 border-b border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-white rounded-lg border border-stone-200">
              <div className="font-bold text-[#0B132B] mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white inline-flex items-center justify-center text-[10px]">1</span>
                <span>Copy Script</span>
              </div>
              <p className="text-stone-500 text-[11px]">
                Upar diye gaye <strong>"Copy SQL Script"</strong> button par click karein.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-stone-200">
              <div className="font-bold text-[#0B132B] mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white inline-flex items-center justify-center text-[10px]">2</span>
                <span>Open Supabase SQL Editor</span>
              </div>
              <p className="text-stone-500 text-[11px]">
                <strong>"Open SQL Editor"</strong> par click karein aur Supabase me naya query tab kholein.
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-stone-200">
              <div className="font-bold text-[#0B132B] mb-1 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#0B132B] text-white inline-flex items-center justify-center text-[10px]">3</span>
                <span>Paste & Click "RUN"</span>
              </div>
              <p className="text-stone-500 text-[11px]">
                Script paste karke <strong>Run</strong> dabaayein. Tables aur RLS security rules turant set ho jayenge!
              </p>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="relative">
          <div className="max-h-80 overflow-y-auto bg-[#0B132B] p-4 text-[12px] font-mono text-stone-300 leading-relaxed">
            <pre>{SUPABASE_SETUP_SQL}</pre>
          </div>
        </div>
      </div>

      {/* Sync details info */}
      <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">
            Real-time Automatic Sync Active
          </p>
          <p className="text-amber-800 leading-relaxed">
            Har naya order checkout hone par automatically Supabase ki <code className="font-mono font-bold">orders</code> table me save hota hai. Jab bhi aap Admin Panel se naya Product add karenge (multiple image URLs, price, stock ke sath) ya order ka status change karenge, wo bhi turant Supabase cloud database me synchronize hoga!
          </p>
        </div>
      </div>
    </div>
  );
};
