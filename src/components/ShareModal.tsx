import React, { useState } from 'react';
import { Product } from '../types';
import { X, Copy, Check, MessageSquare, Send, Share2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface ShareModalProps {
  product: Product;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ product, onClose }) => {
  const { addToast } = useStore();
  const [copied, setCopied] = useState(false);

  const productUrl = `${window.location.origin}/product/${product.slug}`;
  const shareText = `Check out this ${product.name} on Fashion Store for ₹${product.price.toLocaleString('en-IN')}!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(productUrl);
    setCopied(true);
    addToast('Product link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: productUrl,
        });
      } catch {
        // user dismissed
      }
    } else {
      copyToClipboard();
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageSquare,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'Facebook',
      icon: Share2,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
        window.open(url, '_blank');
      },
    },
    {
      name: 'Instagram',
      icon: Share2,
      color: 'bg-pink-600 hover:bg-pink-700',
      action: () => {
        copyToClipboard();
        addToast('Link copied! Share it on your Instagram story or message.', 'info');
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#C59B51]" />
            <h3 className="font-bold text-base text-[#0B132B]">Share Product</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Product Preview Card */}
          <div className="flex items-center gap-3.5 p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE5D9]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg border border-stone-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-stone-900 truncate">{product.name}</h4>
              <p className="text-xs text-stone-500 capitalize">{product.category}</p>
              <p className="text-sm font-bold text-[#0B132B] mt-0.5">
                ₹{product.price.toLocaleString('en-IN')}
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through ml-1.5 font-normal">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Social Channels */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Share directly via</p>
            <div className="grid grid-cols-4 gap-2">
              {shareOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.name}
                    onClick={opt.action}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-stone-50 transition-colors group"
                  >
                    <div className={`w-11 h-11 rounded-full text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${opt.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-stone-700">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copy Link Input */}
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Or copy direct link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={productUrl}
                className="flex-1 px-3 py-2 bg-stone-100 border border-stone-300 rounded-lg text-xs text-stone-700 focus:outline-hidden"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0B132B] text-white hover:bg-[#1E293B] rounded-lg text-xs font-semibold tracking-wide transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-[#ECC88A]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Native Web Share fallback */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 border border-[#C59B51] text-[#0B132B] hover:bg-[#FBF8F3] rounded-xl text-xs font-bold tracking-wide transition-colors"
            >
              More Share Options (System Dialog)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
