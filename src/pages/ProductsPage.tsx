import React, { useState } from 'react';
import { 
  Filter, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Share2, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { NativeAdCard } from '../components/NativeAdCard';
import { formatPrice, calculateDiscount, toBanglaNumber } from '../utils/formatters';

export const ProductsPage: React.FC = () => {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    selectedProductId,
    setSelectedProductId,
    siteSettings
  } = useStore();
  const { addToCart } = useCart();

  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'rating'>('default');
  const [copiedLink, setCopiedLink] = useState(false);

  // If a product detail is selected
  const activeProduct = selectedProductId 
    ? products.find((p) => p.id === selectedProductId) 
    : null;

  // Filter products based on search and category
  let filtered = products.filter((p) => {
    const matchesCategory = !selectedCategory || 
      (selectedCategory === 'flash-sale' ? p.isFlashSale : p.category === selectedCategory);

    const matchesSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (sortBy === 'priceAsc') {
    filtered = [...filtered].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortBy === 'priceDesc') {
    filtered = [...filtered].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  const handleShareProduct = (prodName: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // 1. DETAIL VIEW OF A PRODUCT
  if (activeProduct) {
    const discount = calculateDiscount(activeProduct.price, activeProduct.discountPrice);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <button
          onClick={() => setSelectedProductId(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল পণ্যে ফিরে যান</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images preview */}
          <div className="space-y-4">
            <div className="aspect-square bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={activeProduct.images[0]}
                alt={activeProduct.name}
                className="w-full h-full object-contain max-h-[380px]"
              />
            </div>

            {activeProduct.images.length > 1 && (
              <div className="flex gap-3">
                {activeProduct.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-2 overflow-hidden cursor-pointer hover:border-emerald-500"
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details info */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  {activeProduct.categoryName || activeProduct.category}
                </span>

                <button
                  onClick={() => handleShareProduct(activeProduct.name)}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1 rounded-full transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার করুন'}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {activeProduct.name}
              </h1>

              {/* Rating & Brand */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-slate-800 ml-1">{toBanglaNumber(activeProduct.rating)}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">{toBanglaNumber(activeProduct.reviewsCount)} টি রিভিউ</span>
                {activeProduct.brand && (
                  <>
                    <span className="text-slate-300">|</span>
                    <span className="font-semibold text-slate-700">ব্র্যান্ড: {activeProduct.brand}</span>
                  </>
                )}
              </div>

              {/* Price block */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-baseline gap-3">
                <span className="text-3xl font-black text-emerald-800">
                  {formatPrice(activeProduct.discountPrice || activeProduct.price)}
                </span>
                {activeProduct.discountPrice && (
                  <span className="text-base text-slate-400 line-through">
                    {formatPrice(activeProduct.price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {toBanglaNumber(discount)}% ছাড়
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {activeProduct.description}
              </p>

              {/* Specifications table */}
              {activeProduct.specs && Object.keys(activeProduct.specs).length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    পণ্য স্পেসিফিকেশন:
                  </h4>
                  <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl">
                    {Object.entries(activeProduct.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                        <span className="text-slate-500 font-medium">{key}</span>
                        <span className="text-slate-800 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions & Guarantee */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(activeProduct, 1)}
                  disabled={activeProduct.stock <= 0}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 pt-2">
                <div className="p-2 bg-slate-50 rounded-xl flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>জেনুইন প্রডাক্ট</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl flex flex-col items-center">
                  <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>দ্রুত ডেলিভারি</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>৭ দিনের রিপ্লেসমেন্ট</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. PRODUCTS CATALOG GRID VIEW
  const sidebarAd = siteSettings.adSlots?.slots?.find((s) => s.active && s.position === 'sidebar');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {selectedCategory === 'flash-sale'
              ? '⚡ বিশেষ ফ্ল্যাশ সেল অফার'
              : selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'পণ্য তালিকা'
              : 'সকল গ্যাজেট ও ইলেকট্রনিক্স পণ্য'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            মোট {toBanglaNumber(filtered.length)}টি পণ্য পাওয়া গিয়েছে
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-slate-500 font-medium">সর্ট করুন:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="default">ডিফল্ট</option>
            <option value="priceAsc">দাম: কম থেকে বেশি</option>
            <option value="priceDesc">দাম: বেশি থেকে কম</option>
            <option value="rating">সেরা রেটিং</option>
          </select>
        </div>
      </div>

      {/* Main Grid with Responsive Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Category Filters Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>ক্যাটেগরি অনুযায়ী ফিল্টার</span>
            </h3>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedCategory === null
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>সব ক্যাটেগরি</span>
                <span className={selectedCategory === null ? 'text-emerald-100' : 'text-slate-400'}>
                  {toBanglaNumber(products.length)}
                </span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={selectedCategory === cat.slug ? 'text-emerald-100' : 'text-slate-400'}>
                    {toBanglaNumber(cat.productCount)}
                  </span>
                </button>
              ))}

              <button
                onClick={() => setSelectedCategory('flash-sale')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                  selectedCategory === 'flash-sale'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <span>⚡ ফ্ল্যাশ সেল অফার</span>
                <span>অফার</span>
              </button>
            </div>
          </div>

          {/* Sponsored Sidebar Ad for Desktop */}
          {sidebarAd && siteSettings.adSlots?.sidebarEnabled && (
            <div className="hidden lg:block">
              <NativeAdCard ad={sidebarAd} />
            </div>
          )}
        </div>

        {/* Product Cards Container */}
        <div className="lg:col-span-3 space-y-6">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="font-bold text-slate-700">কোনো পণ্য খুঁজে পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400">
                অন্য কোনো নাম দিয়ে অনুসন্ধান করুন অথবা ক্যাটেগরি পরিবর্তন করুন।
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
              >
                ফিল্টার রিসেট করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
