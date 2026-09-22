import React from 'react';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath,
  navigate,
  onOpenSearch,
}) => {
  const { cart } = useStore();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'HOME', icon: Home, path: '/' },
    { label: 'CATEGORIES', icon: Grid, path: '/shop' },
    { label: 'SEARCH', icon: Search, isAction: true, onClick: onOpenSearch },
    { label: 'CART', icon: ShoppingBag, path: '/cart', badge: totalCartCount },
    { label: 'ACCOUNT', icon: User, path: '/track-order' },
  ];

  return (
    <div id="mobile-bottom-nav" className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] z-40 px-2 py-1.5 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.path && currentPath === item.path;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.isAction && item.onClick) {
                  item.onClick();
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                isActive ? 'text-[#C59B51]' : 'text-stone-600 hover:text-[#0B132B]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#0B132B] text-[#E5C384] text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9.5px] font-bold tracking-wider mt-0.5 uppercase">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
