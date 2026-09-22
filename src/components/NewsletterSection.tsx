import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, CheckCircle2 } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { addToast } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    addToast('Thank you for subscribing to Fashion Store drops!', 'success');
    setEmail('');
  };

  return (
    <section id="newsletter-section" className="py-14 sm:py-16 bg-[#FAF7F2] border-b border-[#E9E4DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="w-12 h-12 rounded-full bg-[#0B132B] text-[#E5C384] mx-auto flex items-center justify-center mb-4 shadow-sm">
          <Mail className="w-5 h-5" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
          SUBSCRIBE TO OUR NEWSLETTER
        </h2>
        
        <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Get updates about new arrivals, seasonal sales, and exclusive fashion drops right in your inbox.
        </p>

        {isSubscribed ? (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold inline-flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>You're on the list! Check your inbox for your welcome privilege code.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full sm:flex-1 px-4 py-3 rounded-md bg-white border border-[#DDD5C7] text-sm text-[#0B132B] placeholder:text-stone-400 focus:outline-hidden focus:border-[#0B132B] shadow-2xs"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

        <p className="text-[11px] text-stone-400 mt-3">
          We respect your privacy. Unsubscribe anytime with a single click.
        </p>

      </div>
    </section>
  );
};
