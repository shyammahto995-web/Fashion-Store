import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  currentPath?: string;
  navigate?: (path: string) => void;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPath = window.location.pathname, 
  navigate,
  onNavigate
}) => {
  const doNavigate = navigate || onNavigate || ((p: string) => { window.location.pathname = p; });
  const { cart, wishlist, products } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsDropdownOpen, setIsCollectionsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const searchResults = searchQuery.trim() === '' ? [] : products.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
  }).slice(0, 5);

  const handleNavClick = (path: string) => {
    doNavigate(path);
    setIsMobileMenuOpen(false);
    setIsCollectionsDropdownOpen(false);
    setIsSearchOpen(false);
  };

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { 
      label: 'COLLECTIONS', 
      isDropdown: true,
      items: [
        { label: "Women's Collection", path: '/category/women' },
        { label: "Men's Collection", path: '/category/men' },
        { label: "Kids Collection", path: '/category/kids' },
        { label: "Luxury Bags", path: '/category/bags' },
        { label: "Timepieces & Watches", path: '/category/watches' },
        { label: "Accessories", path: '/category/accessories' },
        { label: "Beauty & Perfumes", path: '/category/perfumes' },
        { label: "Footwear", path: '/category/footwear' },
      ] 
    },
    { label: 'WOMEN', path: '/category/women' },
    { label: 'MEN', path: '/category/men' },
    { label: 'KIDS', path: '/category/kids' },
    { label: 'ACCESSORIES', path: '/category/accessories' },
    { label: 'ABOUT US', path: '/about' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <header 
        id="main-header"
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-200 border-b border-[#E2E8F0] ${
          isScrolled ? 'shadow-md shadow-black/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* LEFT: Fashion Store Logo */}
            <div 
              className="cursor-pointer py-1"
              onClick={() => handleNavClick('/')}
              id="header-brand-logo"
            >
              <BrandLogo variant="horizontal" theme="dark" size="md" />
            </div>

            {/* CENTER: Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6 lg:gap-7">
              {navLinks.map((link) => {
                if (link.isDropdown) {
                  return (
                    <div 
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setIsCollectionsDropdownOpen(true)}
                      onMouseLeave={() => setIsCollectionsDropdownOpen(false)}
                    >
                      <button 
                        className={`text-[12.5px] font-bold tracking-wider hover:text-[#C59B51] transition-colors py-2 flex items-center gap-1 ${
                          currentPath.startsWith('/category') ? 'text-[#C59B51]' : 'text-[#0B132B]'
                        }`}
                      >
                        {link.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>

                      {isCollectionsDropdownOpen && (
                        <div className="absolute top-full left-0 w-64 bg-white border border-[#E2E8F0] rounded-md shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                          {link.items?.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => handleNavClick(item.path)}
                              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#1E293B] hover:bg-[#F9F6F0] hover:text-[#C59B51] transition-colors flex items-center justify-between group"
                            >
                              <span>{item.label}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.label}
                    onClick={() => link.path && handleNavClick(link.path)}
                    className={`text-[12.5px] font-bold tracking-wider hover:text-[#C59B51] transition-colors relative py-1 ${
                      isActive ? 'text-[#C59B51]' : 'text-[#0B132B]'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C59B51] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* RIGHT: Actions (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Search Toggle */}
              <button
                id="search-toggle-btn"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search products"
                className="p-2 sm:p-2.5 rounded-full text-[#0B132B] hover:bg-[#F4EFE6] transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button
                id="wishlist-toggle-btn"
                onClick={() => handleNavClick('/wishlist')}
                aria-label="Wishlist"
                className="relative p-2 sm:p-2.5 rounded-full text-[#0B132B] hover:bg-[#F4EFE6] transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C59B51] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Account / Track Order */}
              <button
                id="account-btn"
                onClick={() => handleNavClick('/track-order')}
                aria-label="My Account"
                className="hidden sm:flex p-2 sm:p-2.5 rounded-full text-[#0B132B] hover:bg-[#F4EFE6] transition-colors"
                title="Track Order / Account"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Cart Button with Count Badge */}
              <button
                id="header-cart-btn"
                onClick={() => handleNavClick('/cart')}
                aria-label="Shopping Cart"
                className="relative flex items-center gap-2 bg-[#0B132B] text-white hover:bg-[#1E293B] px-3.5 py-2 rounded-full transition-all shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 text-[#E5C384]" />
                <span className="text-xs font-bold tracking-wide">
                  {totalCartCount}
                </span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-md text-[#0B132B] hover:bg-[#F4EFE6] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden fixed inset-x-0 top-20 bg-white border-b border-[#E2E8F0] shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto animate-in slide-in-from-top-4 z-40">
            <div className="px-5 py-6 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <p className="text-xs font-bold tracking-widest text-[#C59B51] uppercase mb-2">EXPLORE CATEGORIES</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button onClick={() => handleNavClick('/category/women')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Women</button>
                  <button onClick={() => handleNavClick('/category/men')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Men</button>
                  <button onClick={() => handleNavClick('/category/kids')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Kids</button>
                  <button onClick={() => handleNavClick('/category/bags')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Bags</button>
                  <button onClick={() => handleNavClick('/category/watches')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Watches</button>
                  <button onClick={() => handleNavClick('/category/accessories')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Accessories</button>
                  <button onClick={() => handleNavClick('/category/perfumes')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Perfumes</button>
                  <button onClick={() => handleNavClick('/category/beauty')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Beauty</button>
                  <button onClick={() => handleNavClick('/category/footwear')} className="text-left py-2 font-medium text-stone-800 hover:text-[#C59B51]">Footwear</button>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-sm font-semibold tracking-wide">
                <button onClick={() => handleNavClick('/')} className="block w-full text-left py-2 text-stone-900 hover:text-[#C59B51]">HOME</button>
                <button onClick={() => handleNavClick('/shop')} className="block w-full text-left py-2 text-stone-900 hover:text-[#C59B51]">ALL PRODUCTS (SHOP)</button>
                <button onClick={() => handleNavClick('/wishlist')} className="block w-full text-left py-2 text-stone-900 hover:text-[#C59B51]">MY WISHLIST ({wishlistCount})</button>
                <button onClick={() => handleNavClick('/cart')} className="block w-full text-left py-2 text-stone-900 hover:text-[#C59B51]">CART ({totalCartCount})</button>
                <button onClick={() => handleNavClick('/track-order')} className="block w-full text-left py-2 text-stone-900 hover:text-[#C59B51]">TRACK ORDER</button>
                <button onClick={() => handleNavClick('/about')} className="block w-full text-left py-2 text-stone-900 hover:text-[#C59B51]">ABOUT US</button>
                <button onClick={() => handleNavClick('/contact')} className="block w-full text-left py-2 text-stone-900 hover:text-[#C59B51]">CONTACT</button>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#EBE3D5] text-xs text-stone-600 flex items-center justify-between">
                  <span>Customer Support: <strong>+91 98765 43210</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-stone-200">
            {/* Search Input Box */}
            <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-stone-200">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by product, category (e.g. handbag, dress, tuxedo, perfume)..."
                className="w-full text-base sm:text-lg focus:outline-hidden text-[#0B132B] placeholder:text-stone-400"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions & Live Results */}
            <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() === '' ? (
                <div>
                  <p className="text-xs font-bold tracking-wider text-stone-400 uppercase mb-3">POPULAR SEARCHES</p>
                  <div className="flex flex-wrap gap-2">
                    {['Signature Handbag', 'Slim-Fit Tuxedo', 'Wrap Dress', 'Timepiece', 'Bleu Royale Perfume', 'Leather Sneaker'].map(term => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-xs font-medium text-stone-700 rounded-full transition-colors border border-[#ECE4D8]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-bold tracking-wider text-stone-400 uppercase">PRODUCTS FOUND ({searchResults.length})</p>
                  {searchResults.map(prod => (
                    <div
                      key={prod.id}
                      onClick={() => handleNavClick(`/product/${prod.slug}`)}
                      className="flex items-center gap-3.5 p-2 rounded-lg hover:bg-[#FAF7F2] cursor-pointer transition-colors"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-14 h-14 object-cover rounded-md border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-stone-900 truncate">{prod.name}</h4>
                        <p className="text-xs text-stone-500 capitalize">{prod.category} • {prod.brand}</p>
                        <div className="text-xs font-bold text-[#0B132B] mt-0.5">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                    </div>
                  ))}
                  <button
                    onClick={() => handleNavClick(`/shop?search=${encodeURIComponent(searchQuery)}`)}
                    className="w-full mt-2 py-2 text-center text-xs font-bold text-[#C59B51] hover:underline"
                  >
                    View all matching products →
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-stone-500">
                  <p className="text-sm">No products found matching "{searchQuery}"</p>
                  <p className="text-xs text-stone-400 mt-1">Try searching for dresses, bags, watches, or men's shirts.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
