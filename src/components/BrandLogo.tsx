import React from 'react';

interface BrandLogoProps {
  variant?: 'horizontal' | 'emblem' | 'mark' | 'footer' | 'image-only';
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'horizontal',
  className = '',
  theme = 'dark', // 'dark' = dark text for light background, 'light' = white/gold text for dark background
  size = 'md',
}) => {
  const isLight = theme === 'light';
  const textColor = isLight ? 'text-white' : 'text-[#0B132B]';
  const subtextColor = isLight ? 'text-[#D1C4B2]' : 'text-[#64748B]';

  // Mark only (Circular brand badge with user's uploaded logo)
  if (variant === 'mark') {
    const markDimensions = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    }[size];

    return (
      <div className={`relative flex items-center justify-center rounded-full p-[1.5px] bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#B28238] shadow-xs overflow-hidden ${markDimensions} ${className}`}>
        <img
          src="/fashion-store-brand-logo.jpg"
          alt="Fashion Store Mark"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Full Circular Emblem matching the official brand logo photo exactly
  if (variant === 'emblem' || variant === 'image-only') {
    const emblemSizes = {
      sm: 'w-24 h-24 sm:w-28 sm:h-28',
      md: 'w-36 h-36 sm:w-44 sm:h-44',
      lg: 'w-48 h-48 sm:w-56 sm:h-56',
      xl: 'w-64 h-64 sm:w-72 sm:h-72',
    }[size];

    return (
      <div className={`flex flex-col items-center justify-center text-center ${className}`}>
        <div className={`${emblemSizes} relative rounded-2xl overflow-hidden shadow-lg border border-[#E8DFC9] bg-white p-1`}>
          <img 
            src="/fashion-store-brand-logo.jpg" 
            alt="Fashion Store Official Brand Logo" 
            className="w-full h-full object-contain filter drop-shadow-md rounded-xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    );
  }

  // Horizontal Header / Footer Logo (User's circular brand logo image + Luxury typography)
  const badgeDimensions = {
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-11 h-11 sm:w-13 sm:h-13',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-18 h-18 sm:w-20 sm:h-20',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Official circular logo image badge with luxury gold bezel */}
      <div className={`relative shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-[#C59B51] via-[#F3E5AB] to-[#996B1E] shadow-sm flex items-center justify-center overflow-hidden ${badgeDimensions}`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
          <img
            src="/fashion-store-brand-logo.jpg"
            alt="Fashion Store Brand Logo"
            className="w-full h-full object-cover transform scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col text-left">
        <div className={`font-serif tracking-[0.16em] text-[15px] sm:text-[19px] font-extrabold leading-tight uppercase ${textColor}`}>
          FASHION STORE
        </div>
        <div className={`tracking-[0.22em] text-[8px] sm:text-[10px] font-bold flex items-center gap-1.5 uppercase ${subtextColor}`}>
          <span>STYLE</span>
          <span className="text-[#C59B51] text-[6px]">●</span>
          <span>QUALITY</span>
          <span className="text-[#C59B51] text-[6px]">●</span>
          <span>YOU</span>
        </div>
      </div>
    </div>
  );
};
