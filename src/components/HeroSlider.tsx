import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Flame,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from '../types';

interface HeroSliderProps {
  banners: HeroBanner[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners }) => {
  const { setSelectedCategory, setActiveView } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const activeBanners = banners.filter((b) => b.active);
  const slides = activeBanners.length > 0 ? activeBanners : banners;

  // Autoplay timer with smooth transition
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleBannerAction = (banner: HeroBanner) => {
    if (banner.link === 'flash-sale') {
      setSelectedCategory('flash-sale');
      setActiveView('products');
    } else if (banner.link && banner.link !== 'products' && !banner.link.startsWith('#')) {
      setSelectedCategory(banner.link);
      setActiveView('products');
    } else {
      setSelectedCategory(null);
      setActiveView('products');
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section 
      className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-slate-800 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Images with Crossfade */}
      <div className="relative h-[440px] sm:h-[480px] lg:h-[500px] w-full overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            } transition-transform duration-1000`}
          >
            {/* Dark & Vibrant Vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
            
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}

        {/* Slide Content */}
        <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-14 flex flex-col justify-center max-w-3xl">
          <div className="animate-fade-in space-y-4">
            {/* Animated Badge */}
            <span className="inline-flex items-center gap-1.5 self-start bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-extrabold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              {currentSlide.badge}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed drop-shadow">
              {currentSlide.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                id="hero-slider-cta"
                onClick={() => handleBannerAction(currentSlide)}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xl shadow-emerald-600/30 hover:scale-[1.03] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{currentSlide.buttonText || 'অফার দেখুন ও কিনুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setSelectedCategory('flash-sale');
                  setActiveView('products');
                }}
                className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 backdrop-blur-xs cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>ধামাকা ফ্ল্যাশ সেল</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Pills on desktop */}
        <div className="hidden lg:flex absolute bottom-6 right-10 z-20 items-center gap-3 text-xs text-slate-300 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>১০০% আসল প্রোডাক্ট</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Truck className="w-4 h-4" />
            <span>বদলগাছী ও নওগাঁ দ্রুত ডেলিভারি</span>
          </div>
        </div>

        {/* Prev / Next Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md border border-slate-700 hover:border-emerald-500 transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/60 hover:bg-emerald-600 text-white backdrop-blur-md border border-slate-700 hover:border-emerald-500 transition-all opacity-80 hover:opacity-100 cursor-pointer shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators & Play/Pause */}
        <div className="absolute bottom-5 left-6 sm:left-10 z-30 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-emerald-500 shadow-md shadow-emerald-500/50'
                  : 'w-2 bg-slate-600/70 hover:bg-slate-400'
              }`}
            />
          ))}

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="ml-2 text-slate-400 hover:text-white p-1 transition-colors"
            title={isPaused ? 'অটোপ্লে চালু করুন' : 'অটোপ্লে থামান'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </section>
  );
};
