import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  FileText, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface PolicyProps {
  initialTab?: 'privacy' | 'refund' | 'warranty' | 'contact' | 'faq';
}

export const PolicyPage: React.FC<PolicyProps> = ({ initialTab = 'refund' }) => {
  const { setActiveView, siteSettings } = useStore();
  const [tab, setTab] = useState<'refund' | 'warranty' | 'privacy' | 'contact' | 'faq'>(initialTab);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top breadcrumb */}
      <button
        onClick={() => setActiveView('home')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>হোমে ফিরে যান</span>
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-sm space-y-3">
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
          গ্রাহক সুরক্ষা ও সেবা নীতিমালা
        </span>
        <h1 className="text-2xl sm:text-3xl font-black">
          ভেনজা (Venza) পলিসি ও কাস্টমার সাপোর্ট সেন্টার
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          বদলগাছী ও নওগাঁর সম্মানিত গ্রাহকদের জন্য স্বচ্ছ, নির্ভরযোগ্য ও ১০০% জেনুইন গ্যাজেট কেনাকাটার সুস্পষ্ট নিয়ম ও গাইডলাইন।
        </p>
      </div>

      {/* Policy Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'refund', label: 'রিটার্ন ও রিফান্ড নীতি', icon: <RotateCcw className="w-4 h-4" /> },
          { id: 'warranty', label: 'ওয়ারেন্টি ও ক্লেইম', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'privacy', label: 'গোপনীয়তা নীতি', icon: <FileText className="w-4 h-4" /> },
          { id: 'contact', label: 'যোগাযোগ ও শপ ঠিকানা', icon: <MapPin className="w-4 h-4" /> },
          { id: 'faq', label: 'সাধারণ জিজ্ঞাসা (FAQ)', icon: <HelpCircle className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              tab === t.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        {/* 1. Return & Refund Policy */}
        {tab === 'refund' && (
          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
              <RotateCcw className="w-6 h-6" />
              <h2 className="text-xl font-black text-slate-900">রিটার্ন ও রিফান্ড নীতিমালা (Return & Refund Policy)</h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex gap-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-emerald-800">৭ দিনের সহজ রিপ্লেসমেন্ট গ্যারান্টি:</strong>
                  <p className="mt-1">
                    পণ্যটি হাতে পাওয়ার পর যদি কোনো দৃশ্যমান ত্রুটি বা ফাংশনাল সমস্যা থাকে, তবে ডেলিভারির দিন থেকে ৭ দিনের মধ্যে সম্পূর্ণ বিনামূল্যে রিপ্লেসমেন্ট সুবিধা পাবেন।
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-base">রিটার্নের প্রধান শর্তাবলী:</h3>
              <ul className="list-disc list-inside space-y-2 text-xs text-slate-600">
                <li>পণ্যের মূল প্যাকেজিং বক্স, চার্জিং কেবল, ওয়ারেন্টি কার্ড এবং আনুষাঙ্গিক সকল পার্টস অক্ষত ও সংরক্ষণ থাকতে হবে।</li>
                <li>পণ্যটি কোনো প্রকার শারীরিক আঘাত (Physical damage), পানি ঢুকে নষ্ট (Water damage) বা অননুমোদিত খোলা হলে রিটার্ন প্রযোজ্য হবে না।</li>
                <li>ক্যাশ অন ডেলিভারিতে পার্সেল রিসিভ করার সময় ডেলিভারি ম্যানের সামনে প্যাকেট চেক করে নেওয়া সর্বাধিক পরামর্শযোগ্য।</li>
              </ul>

              <h3 className="font-bold text-slate-900 text-base pt-2">রিফান্ড প্রক্রিয়া ও সময়সীমা:</h3>
              <p className="text-xs text-slate-600">
                রিটার্ন করা পণ্যটি ভেনজা (Venza) টেস্ট ল্যাবে পৌঁছানোর পর ২ কার্যদিবসের মধ্যে কোয়ালিটি চেক সম্পন্ন হয়। গ্রাহক চাইলে সমমূল্যের অন্য যেকোনো গ্যাজেট বেছে নিতে পারেন অথবা বিকাশ/নগদ/ব্যাংক অ্যাকাউন্টে ৩ কার্যদিবসের মধ্যে টাকা রিফান্ড দেওয়া হয়।
              </p>
            </div>
          </div>
        )}

        {/* 2. Warranty & Claim */}
        {tab === 'warranty' && (
          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-6 h-6" />
              <h2 className="text-xl font-black text-slate-900">ওয়ারেন্টি ক্লেইম গাইডলাইন (Warranty Policy)</h2>
            </div>

            <p className="text-xs text-slate-600">
              ভেনজা (Venza) থেকে ক্রয়কৃত প্রতিটি অফিসিয়াল পণ্যের সাথে প্রস্তুতকারক ব্র্যান্ডের অনুমোদিত অফিসিয়াল ওয়ারেন্টি প্রযোজ্য।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <span className="font-bold text-slate-900">স্মার্টফোন ও ট্যাবলেট</span>
                <p className="text-emerald-700 font-bold">১ বছর অফিসিয়াল ব্র্যান্ড ওয়ারেন্টি</p>
                <p className="text-slate-500 text-[11px]">Xiaomi, Realme, Samsung এর নিকটস্থ অথরাইজড সার্ভিস সেন্টার থেকে সেবা গ্রহণ করা যাবে।</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <span className="font-bold text-slate-900">ইয়ারবাডস ও স্মার্টওয়াচ</span>
                <p className="text-emerald-700 font-bold">৬ মাস থেকে ১ বছর রিপ্লেসমেন্ট</p>
                <p className="text-slate-500 text-[11px]">ম্যানুফ্যাকচারিং ত্রুটির ক্ষেত্রে সরাসরি ভেনজা শপ অথবা সংশ্লিষ্ট ব্র্যান্ডের অফিসিয়াল সাপোর্ট।</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <span className="font-bold text-slate-900">চার্জার ও পাওয়ার ব্যাংক</span>
                <p className="text-emerald-700 font-bold">৬ মাস থেকে ১ বছর ওয়ারেন্টি</p>
                <p className="text-slate-500 text-[11px]">অরিজিনাল ইনভয়েস ও বক্সসহ আমাদের স্টোরে জমা দিলেই দ্রুত সমাধান প্রদান করা হবে।</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
              <strong className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                যেসব ক্ষেত্রে ওয়ারেন্টি প্রযোজ্য হবে না:
              </strong>
              <p className="text-slate-600">
                ভাঙা ডিসপ্লে, বার্ন মার্ক, শর্ট সার্কিট বা ভুল ভোল্টেজের অ্যাডাপ্টার ব্যবহারের ফলে সৃষ্ট ক্ষতি ওয়ারেন্টির আওতাভুক্ত নয়।
              </p>
            </div>
          </div>
        )}

        {/* 3. Privacy Policy */}
        {tab === 'privacy' && (
          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-xl font-black text-slate-900">গোপনীয়তা নীতিমালা (Privacy Policy)</h2>
            </div>

            <p className="text-xs text-slate-600">
              আমরা আপনার তথ্যের সর্বোচ্চ নিরাপত্তা এবং গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ।
            </p>

            <div className="space-y-4 text-xs text-slate-600">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">১. যে তথ্য আমরা সংগ্রহ করি:</h4>
                <p>অর্ডার প্রসেসিং ও হোম ডেলিভারির সুবিধার্থে গ্রাহকের নাম, মোবাইল ফোন নম্বর এবং ডেলিভারির সঠিক ঠিকানা সংরক্ষণ করা হয়।</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">২. তথ্যের নিরাপত্তা ও ব্যবহার:</h4>
                <p>আপনার মোবাইল নম্বর বা কোনো ব্যক্তিগত তথ্য কোনো প্রকার বিজ্ঞাপন নেটওয়ার্ক বা তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না। এটি শুধুমাত্র ডেলিভারি সংক্রান্ত যোগাযোগে ব্যবহৃত হয়।</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">৩. পেমেন্ট ও কার্ড নিরাপত্তা:</h4>
                <p>বিকাশ/নগদ বা কার্ডের কোনো পিন নম্বর বা পাসওয়ার্ড আমাদের সিস্টেমে সংরক্ষিত হয় না। সমস্ত লেনদেন সরাসরি সিকিউর গেটওয়ের মাধ্যমে পরিচালিত হয়।</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. Contact & Shop Address */}
        {tab === 'contact' && (
          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
              <MapPin className="w-6 h-6" />
              <h2 className="text-xl font-black text-slate-900">যোগাযোগ ও ফিজিক্যাল শপ ঠিকানা</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">আমাদের স্টোরের ঠিকানা:</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {siteSettings.contactInfo?.address || 'মেইন রোড, বদলগাছী বাজার, বদলগাছী, নওগাঁ - ৬৫৭০, রাজশাহী বিভাগ, বাংলাদেশ।'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">হেল্পলাইন ও হোয়াটসঅ্যাপ:</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{siteSettings.contactInfo?.phone}</p>
                    <a 
                      href={siteSettings.socialLinks?.whatsapp}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 font-bold hover:underline inline-block mt-1"
                    >
                      সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">দোকান খোলার সময়সূচী:</h4>
                    <p className="text-xs text-slate-600 mt-0.5">শনিবার হতে বৃহস্পতিবার: সকাল ৯:০০ টা – রাত ১০:০০ টা (শুক্রবার বন্ধ)</p>
                  </div>
                </div>
              </div>

              {/* Badalgachhi map showcase */}
              <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">বদলগাছী ও নওগাঁ হাব সুবিধা:</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    বদলগাছী উপজেলার অভ্যন্তরে যেকোনো গ্যাজেটের জন্য সেম-ডে (একই দিনে) হোম ডেলিভারি প্রদান করা হয়। নওগাঁ জেলার অন্যান্য উপজেলায় ২৪-৪৮ ঘণ্টার মধ্যে রেডএক্স / সুন্দরবন পার্সেল সার্ভিসে সরবরাহ করা হয়।
                  </p>
                </div>
                <div className="bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span>জরুরি অনুসন্ধান: {siteSettings.contactInfo?.phone?.split('/')[0]}</span>
                  <Truck className="w-4 h-4 text-emerald-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Frequently Asked Questions (FAQ) */}
        {tab === 'faq' && (
          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-emerald-700 border-b border-slate-100 pb-3">
              <HelpCircle className="w-6 h-6" />
              <h2 className="text-xl font-black text-slate-900">সাধারণ জিজ্ঞাসা (FAQ)</h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'আমি কি পণ্য হাতে পেয়ে টাকা পরিশোধ (Cash on Delivery) করতে পারব?',
                  a: 'হ্যাঁ, সম্পূর্ণ বাংলাদেশ এবং বিশেষ করে নওগাঁ ও বদলগাছীতে ক্যাশ অন ডেলিভারি (COD) সুবিধা রয়েছে। আপনি পণ্যটি রিসিভ করে মূল্য পরিশোধ করতে পারবেন।'
                },
                {
                  q: 'পণ্যটি কি ১০০% আসল (Original)?',
                  a: 'অবশ্যই। ভেনজা (Venza) শুধুমাত্র অনুমোদিত ব্র্যান্ডের ১০০% জেনুইন গ্যাজেট ও অ্যাক্সেসরিজ বিক্রয় করে থাকে। প্রতিটি পণ্যের সাথে ব্র্যান্ডের অফিসিয়াল ওয়ারেন্টি কার্যকর থাকবে।'
                },
                {
                  q: 'ডেলিভারি চার্জ কত এবং কত সময় লাগে?',
                  a: 'বদলগাছী উপজেলায় বিশেষ ফ্রি ডেলিভারি অফার চলছে। নওগাঁ সদর ও অন্যান্য জেলায় ডেলিভারি চার্জ সাধারণত ৬০-১২০ টাকা এবং সময় লাগে ১ থেকে ৩ দিন।'
                },
                {
                  q: 'অর্ডার করার পর স্ট্যাটাস কীভাবে ট্র্যাক করব?',
                  a: 'আমাদের ওয়েবসাইটের উপরে থাকা "আমার অর্ডার" বাটনে ক্লিক করে অথবা আপনার অর্ডারের মোবাইল নম্বর প্রদান করে তৎক্ষণাৎ অর্ডারের বর্তমান ডেলিভারি স্ট্যাটাস চেক করতে পারবেন।'
                }
              ].map((faq, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900">প্রশ্ন: {faq.q}</h4>
                  <p className="text-xs text-slate-600 pt-1">উত্তরঃ {faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
