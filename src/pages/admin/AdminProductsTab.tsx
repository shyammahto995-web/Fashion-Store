import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductCategory } from '../../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Image as ImageIcon,
  AlertCircle,
  Upload,
  Link,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  Star
} from 'lucide-react';

export const AdminProductsTab: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, supabaseStatus } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('women');
  const [brand, setBrand] = useState('Fashion Store Luxe');
  const [price, setPrice] = useState<number>(1499);
  const [originalPrice, setOriginalPrice] = useState<number>(1999);
  const [stock, setStock] = useState<number>(25);
  const [sizes, setSizes] = useState('S, M, L, XL');
  const [colors, setColors] = useState('Navy, Emerald, Rose Gold');
  
  // Multiple Image URLs (Default with Main + 2 additional image slots = 3 slots minimum)
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    '',
    ''
  ]);

  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isTrending, setIsTrending] = useState(true);
  const [isNewArrival, setIsNewArrival] = useState(false);

  const resetForm = () => {
    setName('');
    setCategory('women');
    setBrand('Fashion Store Luxe');
    setPrice(1499);
    setOriginalPrice(1999);
    setStock(25);
    setSizes('S, M, L, XL');
    setColors('Navy, Emerald, Rose Gold');
    setImageUrls([
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      '',
      ''
    ]);
    setVideoUrl('');
    setDescription('');
    setIsTrending(true);
    setIsNewArrival(false);
    setEditingProductId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setName(p.name);
    setCategory(p.category);
    setBrand(p.brand || 'Fashion Store Luxe');
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price);
    setStock(p.stock);
    setSizes(p.sizes ? p.sizes.join(', ') : '');
    setColors(p.colors ? p.colors.join(', ') : '');
    
    // Ensure at least 3 image slots are presented so user can add additional images easily
    const existing = [...p.images];
    while (existing.length < 3) {
      existing.push('');
    }
    setImageUrls(existing);

    setVideoUrl(p.videoUrl || '');
    setDescription(p.description);
    setIsTrending(Boolean(p.isTrending));
    setIsNewArrival(Boolean(p.isNewArrival));
    setIsModalOpen(true);
  };

  // Image helpers
  const handleImageUrlChange = (index: number, val: string) => {
    setImageUrls(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleAddImageSlot = () => {
    setImageUrls(prev => [...prev, '']);
  };

  const handleRemoveImageSlot = (index: number) => {
    setImageUrls(prev => {
      if (prev.length <= 1) {
        return [''];
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setImageUrls(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    setImageUrls(prev => {
      const next = [...prev];
      const item = next.splice(index, 1)[0];
      next.unshift(item);
      return next;
    });
  };

  // Local file upload for individual slot
  const handleSlotFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      if (result) {
        handleImageUrlChange(index, result);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  // Multi-file upload batch
  const handleBatchFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readPromises = fileList.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target?.result as string || '');
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(results => {
      const validResults = results.filter(Boolean);
      setImageUrls(prev => {
        // Fill empty slots first, then append remaining
        const next = [...prev];
        let resIndex = 0;
        for (let i = 0; i < next.length && resIndex < validResults.length; i++) {
          if (!next[i].trim()) {
            next[i] = validResults[resIndex++];
          }
        }
        while (resIndex < validResults.length) {
          next.push(validResults[resIndex++]);
        }
        return next;
      });
    });
    e.target.value = '';
  };

  // Presets helper for quick testing
  const handleLoadSampleGallery = () => {
    setImageUrls([
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80'
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Filter valid images from the list
    const validImages = imageUrls.map(img => img.trim()).filter(Boolean);
    const parsedImages = validImages.length > 0 
      ? validImages 
      : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'];

    // Split sizes & colors
    const parsedSizes = sizes.split(',').map(s => s.trim()).filter(Boolean);
    const parsedColors = colors.split(',').map(c => c.trim()).filter(Boolean);

    // Compute discount %
    const discount = originalPrice > price 
      ? Math.round(((originalPrice - price) / originalPrice) * 100) 
      : 0;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: name.trim(),
        slug,
        category,
        brand: brand.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice),
        discount,
        stock: Number(stock),
        sizes: parsedSizes,
        colors: parsedColors,
        images: parsedImages,
        videoUrl: videoUrl.trim() || undefined,
        description: description.trim(),
        isTrending,
        isNewArrival,
      });
    } else {
      addProduct({
        name: name.trim(),
        slug,
        category,
        brand: brand.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice),
        discount,
        stock: Number(stock),
        sizes: parsedSizes,
        colors: parsedColors,
        images: parsedImages,
        videoUrl: videoUrl.trim() || undefined,
        description: description.trim(),
        rating: 4.8,
        reviewCount: 1,
        isTrending,
        isNewArrival,
        sku: `FS-${Math.floor(1000 + Math.random() * 9000)}`,
      });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif-luxury text-[#0B132B]">
              Product Catalog Management
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              supabaseStatus.productsTableExists ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus.productsTableExists ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span>{supabaseStatus.productsTableExists ? 'Supabase Synced' : 'Supabase (Needs SQL)'}</span>
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Create, edit, restock, or remove products with multiple images, details & prices synced to Supabase.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-[#E5C384]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Control Bar: Search & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-hidden focus:border-[#0B132B]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-[#0B132B] focus:outline-hidden bg-white"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredProducts.length} items
          </span>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Product</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Price (₹)</th>
                <th className="py-3.5 px-4 font-bold">Stock</th>
                <th className="py-3.5 px-4 font-bold">Badges</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= 10 && p.stock > 0;
                const isOut = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img 
                            src={p.images[0]} 
                            alt={p.name} 
                            className="w-12 h-14 object-cover rounded-md border border-stone-200" 
                          />
                          {p.images && p.images.length > 1 && (
                            <span 
                              title={`${p.images.length} photos in gallery`}
                              className="absolute -bottom-1 -right-1 bg-[#0B132B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-2xs"
                            >
                              {p.images.length}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-stone-900 line-clamp-1">{p.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</span>
                            {p.images && p.images.length > 1 && (
                              <span className="text-[9px] text-[#C59B51] font-bold bg-[#FAF5EB] px-1.5 py-0.5 rounded">
                                {p.images.length} Photos
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 capitalize font-semibold text-stone-700">
                      {p.category}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#0B132B]">
                      ₹{p.price.toLocaleString('en-IN')}
                      {p.discount ? (
                        <span className="block text-[10px] font-semibold text-emerald-700">
                          {p.discount}% OFF
                        </span>
                      ) : null}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isOut 
                          ? 'bg-rose-100 text-rose-800' 
                          : isLow 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isOut ? 'Out of Stock' : `${p.stock} in stock`}
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4 space-x-1">
                      {p.isTrending && (
                        <span className="inline-block px-1.5 py-0.5 bg-purple-100 text-purple-800 text-[9px] font-bold rounded-sm uppercase">
                          Trending
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded-sm uppercase">
                          New
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-stone-600 hover:text-[#0B132B] hover:bg-stone-100 rounded-md"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-lg font-bold font-serif-luxury text-[#0B132B]">
                {editingProductId ? 'Edit Product' : 'Add New Product to Catalog'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Silk Anarkali Gown"
                  required
                  className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2.5 rounded-md border border-stone-300 text-sm bg-white focus:outline-hidden focus:border-[#0B132B]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Fashion Store Luxe"
                    className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    required
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    required
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Sizes (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full px-3.5 py-2 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Colors (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    placeholder="Gold, Black, Navy"
                    className="w-full px-3.5 py-2 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                  />
                </div>
              </div>

              {/* MULTIPLE PRODUCT IMAGES SECTION (Requested by User) */}
              <div className="p-4 sm:p-5 rounded-xl border border-stone-200 bg-[#FAF8F5] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[#0B132B] uppercase tracking-wider flex items-center gap-2">
                        <span>Product Images &amp; Gallery URLs</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0B132B] text-white">
                          {imageUrls.filter(u => Boolean(u.trim())).length} Active
                        </span>
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Upload or paste URLs for multiple product views (Main, Angle 2, Angle 3, etc.).
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Batch Upload from device */}
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-stone-300 hover:border-[#0B132B] text-xs font-bold text-stone-700 hover:text-[#0B132B] transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-[#C59B51]" />
                      <span>Upload Files</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleBatchFileUpload} 
                        className="hidden" 
                      />
                    </label>

                    {/* Add More Image Slot */}
                    <button
                      type="button"
                      onClick={handleAddImageSlot}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#0B132B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1E293B] shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#E5C384]" />
                      <span>Add Image URL</span>
                    </button>

                    {/* Quick Demo Angles */}
                    <button
                      type="button"
                      onClick={handleLoadSampleGallery}
                      title="Load 3 high-res fashion angle images for testing"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-semibold transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Sample 3 Angles</span>
                    </button>
                  </div>
                </div>

                {/* List of Image Slots (At least 3 slots visible: Main + 2 more) */}
                <div className="space-y-3">
                  {imageUrls.map((url, idx) => {
                    const isMain = idx === 0;
                    const slotLabel = isMain 
                      ? 'Image 1: Primary Cover (Main View) *' 
                      : idx === 1 
                      ? 'Image 2: Secondary (Side / Angle View)' 
                      : idx === 2 
                      ? 'Image 3: Additional (Back / Detail View)' 
                      : `Image ${idx + 1}: Gallery Angle Photo`;

                    return (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border transition-all ${
                          isMain 
                            ? 'bg-white border-[#C59B51]/40 shadow-xs ring-1 ring-[#C59B51]/20' 
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            {isMain ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-[#FAF5EB] px-2 py-0.5 rounded text-[#C59B51]">
                                <Star className="w-3 h-3 fill-current" />
                                {slotLabel}
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                                {slotLabel}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-auto">
                            {!isMain && url.trim() && (
                              <button
                                type="button"
                                onClick={() => handleMakePrimary(idx)}
                                className="text-[10px] font-bold text-[#C59B51] hover:text-[#0B132B] px-2 py-0.5 rounded hover:bg-[#FAF5EB] transition-colors"
                                title="Set as Main Cover Photo"
                              >
                                Set as Main
                              </button>
                            )}

                            {idx > 0 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'up')}
                                className="p-1 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {idx < imageUrls.length - 1 && (
                              <button
                                type="button"
                                onClick={() => handleMoveImage(idx, 'down')}
                                className="p-1 text-stone-400 hover:text-stone-700 rounded hover:bg-stone-100"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {(imageUrls.length > 3 || !isMain) && (
                              <button
                                type="button"
                                onClick={() => handleRemoveImageSlot(idx)}
                                className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-rose-50"
                                title="Remove Slot"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Live Preview Thumbnail Box */}
                          <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 flex items-center justify-center relative group">
                            {url.trim() ? (
                              <img 
                                src={url} 
                                alt={`Slot ${idx + 1}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80';
                                }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-stone-400 p-1 text-center">
                                <ImageIcon className="w-5 h-5 mb-0.5 opacity-50" />
                                <span className="text-[9px] font-medium leading-tight">Empty</span>
                              </div>
                            )}
                          </div>

                          {/* Inputs: URL String + File Upload Button */}
                          <div className="flex-1 space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Link className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                                <input
                                  type="url"
                                  value={url}
                                  onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                  placeholder={isMain ? "https://... (Cover Image URL)" : `https://... (Angle ${idx + 1} Image URL)`}
                                  required={isMain}
                                  className="w-full pl-8 pr-3 py-2 rounded-md border border-stone-300 text-xs font-mono focus:outline-hidden focus:border-[#0B132B] bg-white"
                                />
                              </div>

                              {/* Direct File Upload for this slot */}
                              <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-2 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold shrink-0 transition-colors border border-stone-200">
                                <Upload className="w-3.5 h-3.5 text-stone-500" />
                                <span className="hidden sm:inline">Upload</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleSlotFileUpload(idx, e)}
                                  className="hidden"
                                />
                              </label>

                              {url && (
                                <button
                                  type="button"
                                  onClick={() => handleImageUrlChange(idx, '')}
                                  className="text-[11px] text-stone-400 hover:text-stone-700 px-1.5 py-1"
                                  title="Clear input"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-stone-400 truncate">
                              Enter web image URL or click Upload to pick a photo from your computer or phone.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#C59B51]" />
                    <span>Multiple images automatically create an interactive gallery on the product page.</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddImageSlot}
                    className="text-xs font-bold text-[#0B132B] hover:text-[#C59B51] underline"
                  >
                    + Add Another Image URL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Video Demonstration URL (Optional)
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://assets.mixkit.co/videos/preview/..."
                  className="w-full px-3.5 py-2 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description, fabric qualities, and styling notes..."
                  className="w-full px-3.5 py-2 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="accent-[#0B132B] w-4 h-4 rounded-sm"
                  />
                  <span>Mark as Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-[#0B132B] w-4 h-4 rounded-sm"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-md border border-stone-300 text-stone-700 text-xs font-bold uppercase tracking-wider hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  {editingProductId ? 'Update Product' : 'Save & Publish Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
