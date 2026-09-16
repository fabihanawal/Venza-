import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Facebook, 
  Instagram, 
  Youtube, 
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sanitizeInput } from '../utils/formatters';

export const Footer: React.FC = () => {
  const { siteSettings, categories, setSelectedCategory, setActiveView } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email: sanitizeInput(newsletterEmail),
        createdAt: Date.now(),
        source: 'footer-form'
      });
      setSubscribed(true);
      setNewsletterEmail('');
    } catch (err) {
      console.warn('Newsletter local fallback subscribe:', err);
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      {/* 1. Value Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">১০০% আসল পণ্য</h4>
              <p className="text-xs text-slate-400">অফিসিয়াল ওয়ারেন্টি সুবিধা</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">দ্রুত ডেলিভারি</h4>
              <p className="text-xs text-slate-400">নওগাঁ ও সারাদেশে হোম ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">৭ দিনের রিপ্লেসমেন্ট</h4>
              <p className="text-xs text-slate-400">সহজ ও বিশ্বস্ত রিটার্ন পলিসি</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-slate-400">বিকাশ, নগদ বা হাতে পেয়ে পরিশোধ</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-lg">
                V
              </div>
              <span className="text-2xl font-black text-white tracking-tight">ভেনজা (Venza)</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              বদলগাছী, নওগাঁ ভিত্তিক আপনার বিশ্বস্ত গ্যাজেট ও আধুনিক ইলেকট্রনিক্স স্টোর। জেনুইন স্মার্টফোন, ল্যাপটপ অ্যাক্সেসরিজ, টিডব্লিউএস ইয়ারবাডস ও স্মার্টওয়াচ।
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{siteSettings.contactInfo?.address || 'বদলগাছী বাজার প্রধান সড়ক, নওগাঁ - ৬৫৭০'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteSettings.contactInfo?.phone || '০১৭০০-০০০০০০'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{siteSettings.contactInfo?.email || 'rstsbd@gmail.com'}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteSettings.socialLinks?.facebook || 'https://facebook.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks?.instagram || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks?.youtube || 'https://youtube.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.socialLinks?.whatsapp || 'https://wa.me/8801700000000'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-500 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">জনপ্রিয় ক্যাটেগরি</h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(c.slug);
                      setActiveView('products');
                    }}
                    className="hover:text-emerald-400 transition-colors text-slate-400"
                  >
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('flash-sale');
                    setActiveView('products');
                  }}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  ⚡ বিশেষ ফ্ল্যাশ সেল
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">গ্রাহক সেবা ও নীতি</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('orders')} className="hover:text-emerald-400 transition-colors">
                  অর্ডার ট্র্যাকিং
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('blog')} className="hover:text-emerald-400 transition-colors">
                  টেক ব্লগ ও রিভিউ
                </button>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">রিটার্ন ও রিফান্ড নীতিমালা</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">ওয়ারেন্টি ক্লেইম গাইডলাইন</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">গোপনীয়তা নীতিমালা</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">নিউজলেটার সাবস্ক্রিপশন</h4>
            <p className="text-xs text-slate-400">
              নতুন অফার, ডিসকাউন্ট ভাউচার ও গ্যাজেট লঞ্চের খবর সরাসরি ইমেইলে পেতে সাবস্ক্রাইব করুন।
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>ধন্যবাদ! ভেনজা নিউজলেটারে আপনাকে স্বাগত।</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="আপনার ইমেইল অ্যাড্রেস..."
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'সংরক্ষণ হচ্ছে...' : 'সাবস্ক্রাইব করুন'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar & Payment Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© ২০২৬ ভেনজা (Venza) গ্যাজেট ও ইলেকট্রনিক্স। সর্বস্বত্ব সংরক্ষিত। বদলগাছী, নওগাঁ।</p>
        
        {/* Payment logos representation */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">নিরাপদ পেমেন্ট পার্টনার:</span>
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 bg-pink-700/20 text-pink-400 rounded text-[10px] font-bold border border-pink-700/30">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-orange-700/20 text-orange-400 rounded text-[10px] font-bold border border-orange-700/30">
              নগদ
            </span>
            <span className="px-2 py-0.5 bg-blue-700/20 text-blue-400 rounded text-[10px] font-bold border border-blue-700/30">
              VISA
            </span>
            <span className="px-2 py-0.5 bg-emerald-700/20 text-emerald-400 rounded text-[10px] font-bold border border-emerald-700/30">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
