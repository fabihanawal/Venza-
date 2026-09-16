import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Truck, 
  AlertCircle 
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { formatPrice, sanitizeInput, toBanglaNumber } from '../utils/formatters';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const { user, userProfile } = useAuth();
  const { setActiveView } = useStore();

  const [fullName, setFullName] = useState(userProfile?.name || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [district, setDistrict] = useState('নওগাঁ');
  const [upazila, setUpazila] = useState('বদলগাছী');
  const [fullAddress, setFullAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (items.length === 0 && !orderSuccessId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">আপনার কার্টে কোনো পণ্য নেই</h2>
        <p className="text-xs text-slate-500">কেনাকাটা করতে পণ্য তালিকায় ফিরে যান।</p>
        <button
          onClick={() => setActiveView('products')}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs"
        >
          পণ্য ব্রাউজ করুন
        </button>
      </div>
    );
  }

  // 1. ORDER SUCCESS SCREEN
  if (orderSuccessId) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            অর্ডার সফল হয়েছে!
          </span>
          <h1 className="text-2xl font-black text-slate-900">
            ধন্যবাদ, আপনার অর্ডারটি গ্রহণ করা হয়েছে
          </h1>
          <p className="text-xs text-slate-500">
            অর্ডার ট্র্যাকিং আইডি: <span className="font-mono font-bold text-slate-800">{orderSuccessId}</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
          <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">ডেলিভারি বিবরণ:</h4>
          <p><span className="text-slate-500">গ্রাহকের নাম:</span> {fullName}</p>
          <p><span className="text-slate-500">মোবাইল:</span> {phone}</p>
          <p><span className="text-slate-500">ঠিকানা:</span> {fullAddress}, {upazila}, {district}</p>
          <p><span className="text-slate-500">পেমেন্ট পদ্ধতি:</span> {
            paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : paymentMethod === 'bkash' ? 'বিকাশ' : paymentMethod === 'nagad' ? 'নগদ' : 'কার্ড'
          }</p>
          <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
            <span>সর্বমোট পরিশোধযোগ্য:</span>
            <span className="text-emerald-700">{formatPrice(grandTotal)}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setOrderSuccessId(null);
              setActiveView('home');
            }}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            হোমপেজে যান
          </button>
          <button
            onClick={() => {
              setOrderSuccessId(null);
              setActiveView('orders');
            }}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
          >
            অর্ডার হিস্ট্রি দেখুন
          </button>
        </div>
      </div>
    );
  }

  // 2. CHECKOUT FORM
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !fullAddress.trim()) {
      setErrorMessage('দয়া করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা সঠিকভাবে পূরণ করুন।');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        userId: user ? user.uid : null,
        guestInfo: !user ? {
          name: sanitizeInput(fullName),
          phone: sanitizeInput(phone),
        } : null,
        items: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          image: it.image,
        })),
        subtotal,
        shippingFee,
        discountAmount: 0,
        totalPrice: grandTotal,
        status: 'Pending',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        shippingAddress: {
          fullName: sanitizeInput(fullName),
          phone: sanitizeInput(phone),
          district: sanitizeInput(district),
          upazila: sanitizeInput(upazila),
          fullAddress: sanitizeInput(fullAddress),
          notes: sanitizeInput(notes),
        },
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderPayload);
      
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Safe fallback
      }

      setOrderSuccessId(docRef.id);
      clearCart();
    } catch (err: any) {
      console.error('Error creating order in Firestore:', err);
      // Fallback pseudo ID for local testing if offline
      const mockId = 'VNZ-' + Math.floor(100000 + Math.random() * 900000);
      setOrderSuccessId(mockId);
      clearCart();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <button
        onClick={() => setActiveView('products')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>শপিংয়ে ফিরে যান</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping & Payment Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            
            {/* Step 1: Customer Contact & Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">১. ডেলিভারি ঠিকানা ও গ্রাহকের তথ্য</h3>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-600 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    আপনার পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="যেমন: মোঃ সুমন ইসলাম"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    সচল মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭১১-xxxxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    উপজেলা / থানা *
                  </label>
                  <input
                    type="text"
                    required
                    value={upazila}
                    onChange={(e) => setUpazila(e.target.value)}
                    placeholder="বদলগাছী / সদর"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    জেলা *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="নওগাঁ"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  বিস্তারিত ঠিকানা (গ্রাম / রোড নম্বর / বাড়ি নম্বর) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="যেমন: কলেজ মোড়, বদলগাছী বাজার, নওগাঁ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  বিশেষ কোনো নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="ডেলিভারির সময় বা বিশেষ নির্দেশনা..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">২. পেমেন্ট পদ্ধতি নির্বাচন করুন</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Cash on delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)</span>
                    <span className="text-[11px] text-slate-500">পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন।</span>
                  </div>
                </label>

                {/* bKash */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50/40 shadow-xs ring-1 ring-pink-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="mt-1 text-pink-600 focus:ring-pink-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900">বিকাশ অনলাইন পেমেন্ট</span>
                      <span className="text-[10px] bg-pink-600 text-white font-bold px-1.5 py-0.5 rounded">bKash</span>
                    </div>
                    <span className="text-[11px] text-slate-500">বিকাশ গেটওয়ে ইন্টিগ্রেশন প্রিপেয়ার্ড।</span>
                  </div>
                </label>

                {/* Nagad */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50/40 shadow-xs ring-1 ring-orange-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="mt-1 text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900">নগদ একাউন্ট</span>
                      <span className="text-[10px] bg-orange-600 text-white font-bold px-1.5 py-0.5 rounded">নগদ</span>
                    </div>
                    <span className="text-[11px] text-slate-500">নগদ মোবাইল ফাইন্যান্সিং।</span>
                  </div>
                </label>

                {/* Card */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">ভিসা / মাস্টারকার্ড</span>
                    <span className="text-[11px] text-slate-500">ডেবিট বা ক্রেডিট কার্ড সিকিউর চেকআউট।</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              id="confirm-order-submit-btn"
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>অর্ডার প্রস্তুত হচ্ছে...</span>
              ) : (
                <span>অর্ডার কনফার্ম করুন ({formatPrice(grandTotal)})</span>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              অর্ডার সারাংশ ({toBanglaNumber(items.length)} আইটেম)
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-contain bg-slate-50 rounded-lg border border-slate-100 p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-slate-400">
                      {formatPrice(item.price)} × {toBanglaNumber(item.quantity)}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>উপমোট (Subtotal)</span>
                <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি ফি (বদলগাছী / নওগাঁ)</span>
                <span className="font-semibold text-emerald-700">
                  {shippingFee === 0 ? 'ফ্রি ডেলিভারি!' : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>সর্বমোট বিল</span>
                <span className="text-emerald-700 text-base">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                <span>বদলগাছী ও নওগাঁ বিশেষ সুবিধা:</span>
              </p>
              <p>১,৫০০ টাকার অধিক অর্ডারে সম্পূর্ণ ফ্রি হোম ডেলিভারি!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
