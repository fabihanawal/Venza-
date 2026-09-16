import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  PhoneCall, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown,
  LogOut,
  Sliders,
  PackageCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toBanglaNumber } from '../utils/formatters';

export const Header: React.FC = () => {
  const { 
    categories, 
    siteSettings, 
    searchQuery, 
    setSearchQuery, 
    activeView, 
    setActiveView, 
    setSelectedCategory 
  } = useStore();
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleCategoryClick = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setActiveView('products');
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveView('products');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all">
      {/* 1. Announcement Bar */}
      {siteSettings.announcementBar?.enabled && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-700 text-white text-xs md:text-sm py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <span>{siteSettings.announcementBar.text}</span>
          <span className="hidden sm:inline-block bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
            বদলগাছী, নওগাঁ
          </span>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button 
              id="brand-logo-btn"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('home');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                V
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                    ভেনজা
                  </span>
                  <span className="text-xs uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    VENZA
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium -mt-0.5">গ্যাজেট ও ইলেকট্রনিক্স • বদলগাছী</p>
              </div>
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="স্মার্টফোন, ইয়ারবাডস, চার্জার বা গ্যাজেট খুঁজুন..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                id="search-submit-btn"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
              >
                খুঁজুন
              </button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* WhatsApp Direct */}
            <a
              id="whatsapp-header-btn"
              href={siteSettings.socialLinks?.whatsapp || 'https://wa.me/8801700000000'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-full border border-emerald-200 transition-colors"
              title="হোয়াটসঅ্যাপে অর্ডার বা জিজ্ঞাসা"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>সহায়তা</span>
            </a>

            {/* Admin Badge/Link if Admin */}
            {isAdmin && (
              <button
                id="admin-nav-btn"
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                  activeView === 'admin'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">এডমিন প্যানেল</span>
                <span className="sm:hidden">এডমিন</span>
              </button>
            )}

            {/* Cart Button */}
            <button
              id="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
              aria-label="শপিং কার্ট"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {toBanglaNumber(totalItems)}
                </span>
              )}
            </button>

            {/* User Auth Section */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    id="user-profile-menu-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200 text-slate-800"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                        {user.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="hidden md:inline text-xs font-medium max-w-[90px] truncate">
                      {user.displayName || 'গ্রাহক'}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">লগইন রয়েছেন:</p>
                        <p className="text-sm font-bold text-slate-800 truncate">{user.displayName}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="mt-1 inline-block text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            ★ স্টোর এডমিন
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setActiveView('orders');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4 text-emerald-600" />
                        <span>আমার অর্ডারসমূহ</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setActiveView('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold text-amber-800 hover:bg-amber-50 flex items-center gap-2"
                        >
                          <Sliders className="w-4 h-4 text-amber-600" />
                          <span>এডমিন ড্যাশবোর্ড</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>লগআউট করুন</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="google-login-header-btn"
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-full text-xs font-semibold shadow-sm transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">লগইন / সাইন ইন</span>
                  <span className="sm:hidden">লগইন</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য বা গ্যাজেট খুঁজুন..."
              className="w-full pl-9 pr-20 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-emerald-600 text-white rounded-full text-xs font-medium"
            >
              খুঁজুন
            </button>
          </div>
        </form>
      </div>

      {/* 3. Category & Navigation Menu Bar */}
      <nav className="bg-slate-900 text-white hidden lg:block border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-1 py-1">
            <button
              id="nav-all-products"
              onClick={() => {
                setSelectedCategory(null);
                setActiveView('products');
              }}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeView === 'products' && !categories.some(c => c.slug === searchQuery)
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              সব পণ্য
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}

            <button
              id="nav-flash-sale"
              onClick={() => {
                setSelectedCategory('flash-sale');
                setActiveView('products');
              }}
              className="px-3 py-2 text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:bg-slate-800 rounded-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ফ্ল্যাশ সেল</span>
            </button>

            <button
              id="nav-blog"
              onClick={() => setActiveView('blog')}
              className={`px-3 py-2 rounded-md transition-colors ${
                activeView === 'blog'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              ব্লগ ও রিভিউ
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>১০০% অফিসিয়াল ও আসল পণ্য</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[108px] bg-slate-900/60 backdrop-blur-sm z-50">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="font-bold text-slate-900">মেনু নির্বাচন</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-md text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveView('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg"
              >
                হোম
              </button>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setActiveView('products');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg"
              >
                সব পণ্য ক্যাটালগ
              </button>

              <div className="pt-2 pb-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ক্যাটেগরিসমূহ
              </div>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-slate-400">({toBanglaNumber(cat.productCount)})</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setActiveView('blog');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg"
              >
                টেক ব্লগ ও রিভিউ
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg"
                >
                  এডমিন ড্যাশবোর্ড
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">যোগাযোগ ও দোকান ঠিকানা:</p>
              <p>{siteSettings.contactInfo.address}</p>
              <p className="text-emerald-700 font-bold">{siteSettings.contactInfo.phone}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
