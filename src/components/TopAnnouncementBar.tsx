import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TopAnnouncementBarProps {
  onShopClick?: () => void;
}

export const TopAnnouncementBar: React.FC<TopAnnouncementBarProps> = ({ onShopClick }) => {
  return (
    <div id="announcement-bar" className="bg-[#0B132B] text-white text-xs py-2 px-3 sm:px-6 border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left / Center Promotional Text */}
        <div className="flex items-center gap-2 tracking-wider font-medium text-[11px] sm:text-xs">
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span className="text-[#E2E8F0]">
            <span className="hidden md:inline font-bold text-white">FOR MODERN LUXURY &amp; EVERYDAY COMFORT: </span>
            NEW SEASON STYLES ARE HERE — UP TO 50% OFF
          </span>
        </div>

        {/* Right CTA Button */}
        <button
          onClick={onShopClick}
          className="shrink-0 group inline-flex items-center gap-1.5 bg-[#FAF9F5] text-[#0B132B] hover:bg-[#EBDDC8] px-3 py-1 rounded-sm font-bold text-[10px] sm:text-[11px] uppercase tracking-wider transition-all duration-200"
        >
          <span>LET'S SHOP</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
