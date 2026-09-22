import React from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Lock,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-[#0B132B] text-white pt-14 pb-8 border-t border-[#1C2640]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1E293B]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('/')}
              className="cursor-pointer inline-block"
            >
              <BrandLogo variant="horizontal" theme="light" size="lg" />
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Your premier Indian destination for modern fashion, accessories and lifestyle essentials. Designed around three everlasting pillars: Style • Quality • You.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#instagram" 
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#18233C] text-stone-300 hover:text-[#E5C384] hover:bg-[#223154] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="#facebook" 
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#18233C] text-stone-300 hover:text-[#E5C384] hover:bg-[#223154] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="#youtube" 
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#18233C] text-stone-300 hover:text-[#E5C384] hover:bg-[#223154] flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#pinterest" 
                aria-label="Pinterest"
                className="w-8 h-8 rounded-full bg-[#18233C] text-stone-300 hover:text-[#E5C384] hover:bg-[#223154] flex items-center justify-center transition-colors font-bold text-xs"
              >
                P
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#E5C384] uppercase">QUICK LINKS</h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-stone-300">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-white transition-colors">Shop All</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/women')} className="hover:text-white transition-colors">Women's Collection</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/category/men')} className="hover:text-white transition-colors">Men's Collection</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">About Us</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">Contact Us</button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#E5C384] uppercase">CUSTOMER SERVICE</h4>
            <ul className="space-y-2 text-xs sm:text-[13px] text-stone-300">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">FAQs &amp; Help</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">Shipping Policy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">Returns &amp; Refunds</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">Terms &amp; Conditions</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">Privacy Policy</button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#E5C384] uppercase">CONTACT US</h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-stone-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E5C384] shrink-0" />
                <a href="tel:6299797984" className="hover:text-white transition-colors">+91 6299797984</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E5C384] shrink-0" />
                <a href="mailto:shyammahto99665@gmail.com" className="truncate hover:text-white transition-colors">shyammahto99665@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E5C384] shrink-0 mt-0.5" />
                <span className="text-[11px] leading-tight">High Street Phoenix, Lower Parel, Mumbai, Maharashtra 400013</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('/track-order')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#162138] hover:bg-[#202E4E] text-[#E5C384] text-xs font-semibold tracking-wider transition-colors border border-[#27385E]"
              >
                <span>Track Your Order</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright, Payment Badges & Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div>
            &copy; {new Date().getFullYear()} Fashion Store. All Rights Reserved. Style • Quality • You.
          </div>

          {/* Payment Badges (COD Highlighted) */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-sm bg-emerald-950/80 border border-emerald-500/40 text-[10px] sm:text-[11px] font-bold text-emerald-300">
              CASH ON DELIVERY (COD)
            </span>
            <span className="px-2 py-0.5 rounded-sm bg-white/10 text-[10px] font-bold text-stone-300">100% VERIFIED</span>
          </div>

          {/* Small Admin Panel Link (Strictly at very bottom as requested) */}
          <div>
            <button
              id="footer-admin-link"
              onClick={() => onNavigate('/admin/login')}
              className="text-[11px] text-stone-500 hover:text-[#E5C384] transition-colors flex items-center gap-1 underline underline-offset-4"
              title="Restricted Staff & Admin Portal"
            >
              <Lock className="w-3 h-3" />
              <span>ADMIN PANEL</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
