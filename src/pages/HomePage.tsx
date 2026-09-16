import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Smartphone, 
  Headphones, 
  Watch, 
  Laptop, 
  BatteryCharging, 
  Zap,
  ShoppingBag,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { NativeAdCard } from '../components/NativeAdCard';
import { HeroSlider } from '../components/HeroSlider';
import { toBanglaNumber } from '../utils/formatters';

export const HomePage: React.FC = () => {
  const { products, categories, siteSettings, setSelectedCategory, setActiveView } = useStore();

  // Flash sale countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured);
  const flashSaleProducts = products.filter((p) => p.isFlashSale);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-6 h-6" />;
      case 'Laptop': return <Laptop className="w-6 h-6" />;
      case 'Headphones': return <Headphones className="w-6 h-6" />;
      case 'Watch': return <Watch className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6 text-amber-500" />;
      case 'BatteryCharging': return <BatteryCharging className="w-6 h-6" />;
      default: return <Zap className="w-6 h-6" />;
    }
  };

  const heroBannersList = siteSettings.heroBanners && siteSettings.heroBanners.length > 0 
    ? siteSettings.heroBanners 
    : [];
  const gridAds = siteSettings.adSlots?.slots?.filter((s) => s.active && s.position === 'productGrid') || [];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Interactive Hero Slider with Smooth Transitions */}
      {heroBannersList.length > 0 && (
        <HeroSlider banners={heroBannersList} />
      )}

      {/* 2. Flash Sale Section with Countdown Timer */}
      {siteSettings.flashSale?.enabled && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-200/80 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-6 border-b border-amber-200/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                  <Flame className="w-6 h-6 fill-slate-950 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {siteSettings.flashSale.title}
                    </h2>
                    <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                      {siteSettings.flashSale.discountBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">বদলগাছী শপের জন্য সীমিত সময় ও স্টক অফার</p>
                </div>
              </div>

              {/* Countdown Timer Display */}
              <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-2xl shadow-xs border border-amber-100 self-stretch md:self-auto justify-center">
                <Clock className="w-4 h-4 text-rose-500 mr-1" />
                <span className="text-xs font-bold text-slate-600">বাকি সময়:</span>
                <div className="flex items-center gap-1 font-mono font-black text-slate-900">
                  <span className="bg-slate-900 text-white px-2 py-1 rounded text-xs">
                    {toBanglaNumber(String(timeLeft.hours).padStart(2, '0'))}
                  </span>
                  <span>:</span>
                  <span className="bg-slate-900 text-white px-2 py-1 rounded text-xs">
                    {toBanglaNumber(String(timeLeft.minutes).padStart(2, '0'))}
                  </span>
                  <span>:</span>
                  <span className="bg-rose-600 text-white px-2 py-1 rounded text-xs">
                    {toBanglaNumber(String(timeLeft.seconds).padStart(2, '0'))}
                  </span>
                </div>
              </div>
            </div>

            {/* Flash Sale Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {flashSaleProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              পণ্য ক্যাটেগরিসমূহ
            </h2>
            <p className="text-xs text-slate-500">আপনার প্রয়োজনীয় গ্যাজেট নির্বাচন করুন</p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setActiveView('products');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug);
                setActiveView('products');
              }}
              className="group cursor-pointer bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition-all text-center flex flex-col items-center justify-center gap-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                {getCategoryIcon(cat.icon)}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  {toBanglaNumber(cat.productCount)}+ পণ্য
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Products with Integrated Native Ad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              জনপ্রিয় ও বিশেষ গ্যাজেট
            </h2>
            <p className="text-xs text-slate-500">সেরা রিভিউপ্রাপ্ত ও টপ রেটেড পণ্য সম্ভার</p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setActiveView('products');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>সব পণ্য</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product, index) => {
            // Native Ad inserted in the grid after 3rd product
            const showAd = index === 2 && gridAds.length > 0 && siteSettings.adSlots?.productGridEnabled;
            return (
              <React.Fragment key={product.id}>
                <ProductCard product={product} />
                {showAd && (
                  <NativeAdCard ad={gridAds[0]} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* 5. Brand List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200">
          <div className="text-center max-w-md mx-auto mb-6">
            <h3 className="text-lg font-black text-slate-900">জনপ্রিয় গ্যাজেট ও টেক ব্র্যান্ডসমূহ</h3>
            <p className="text-xs text-slate-500 mt-1">ভেনজা-তে আপনি পাবেন সকল অথেন্টিক ব্র্যান্ডের আসল পণ্য</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 font-black text-sm sm:text-base tracking-wider uppercase">
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">XIAOMI</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">REALME</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">AMAZFIT</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">BASEUS</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">REMAX</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">JBL</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">LOGITECH</span>
            <span className="hover:text-emerald-600 transition-colors cursor-pointer">ANKER</span>
          </div>
        </div>
      </section>

      {/* 6. Badalgachhi Local Store Highlight & Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-800/40 px-3 py-1 rounded-full border border-emerald-700">
              বদলগাছী ও নওগাঁর নিজস্ব শপ
            </span>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              সরাসরি শপে এসে দেখে কেনার সুবিধা অথবা দ্রুত হোম ডেলিভারি
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              অনলাইন অর্ডারের পাশাপাশি আমাদের বদলগাছী বাজার শপে এসে পণ্যটি সরাসরি দেখে, চেক করে কেনার সুবিধা রয়েছে। যেকোনো গ্যাজেট সম্পর্কিত পরামর্শের জন্য আমাদের দক্ষ টিম প্রস্তুত।
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                ক্যাশ অন ডেলিভারি (হাতে পেয়ে মূল্য পরিশোধ)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                বিকাশ/নগদ পেমেন্টে বিশেষ ছাড়
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
