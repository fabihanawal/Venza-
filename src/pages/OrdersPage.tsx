import React, { useEffect, useState } from 'react';
import { 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ArrowLeft,
  Search
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { formatPrice, formatBanglaDate, toBanglaNumber } from '../utils/formatters';

export const OrdersPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const { setActiveView } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestPhoneSearch, setGuestPhoneSearch] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      // Sort newest first
      ords.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(ords);
      setLoading(false);
    }, (err) => {
      console.warn('Orders listener error:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Guest order lookup by phone
  const handleGuestSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPhoneSearch.trim()) return;

    const q = query(
      collection(db, 'orders'),
      where('shippingAddress.phone', '==', guestPhoneSearch.trim())
    );

    onSnapshot(q, (snapshot) => {
      const found = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      found.sort((a, b) => b.createdAt - a.createdAt);
      setSearchedOrders(found);
    });
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            অপেক্ষমাণ (Pending)
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
            <PackageCheck className="w-3 h-3" />
            নিশ্চিত হয়েছে (Confirmed)
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-full">
            <Truck className="w-3 h-3" />
            ডেলিভারিতে রয়েছে (Shipped)
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            ডেলিভারি সম্পন্ন (Delivered)
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            বাতিল (Cancelled)
          </span>
        );
    }
  };

  const displayedOrders = user ? orders : searchedOrders || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => setActiveView('home')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>হোমে ফিরে যান</span>
      </button>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <h1 className="text-2xl font-black text-slate-900">আমার অর্ডার ও ট্র্যাকিং</h1>
        <p className="text-xs text-slate-500">
          আপনার বর্তমান ও অতীত অর্ডারের বর্তমান অবস্থা এবং ডেলিভারি বিবরণ দেখুন।
        </p>
      </div>

      {/* Guest Search Box */}
      {!user && (
        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">গেস্ট অর্ডার ট্র্যাকিং:</h3>
          <p className="text-xs text-slate-600">
            অর্ডারের সময় যে মোবাইল নম্বরটি ব্যবহার করেছিলেন তা প্রবেশ করিয়ে অর্ডার চেক করুন:
          </p>
          <form onSubmit={handleGuestSearch} className="flex gap-2 max-w-md">
            <input
              type="tel"
              required
              value={guestPhoneSearch}
              onChange={(e) => setGuestPhoneSearch(e.target.value)}
              placeholder="মোবাইল নম্বর (যেমন: 017...)"
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>খুঁজুন</span>
            </button>
          </form>

          <div className="pt-2">
            <span className="text-xs text-slate-500">অথবা সব অর্ডার সহজে পেতে </span>
            <button
              onClick={signInWithGoogle}
              className="text-xs font-bold text-emerald-700 underline"
            >
              গুগল দিয়ে লগইন করুন
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {displayedOrders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-2">
            <p className="font-bold text-slate-700">কোনো অর্ডার পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400">
              আপনি এখনো কোনো অর্ডার করেননি অথবা সঠিক মোবাইল নম্বর দিয়ে সন্ধান করুন।
            </p>
          </div>
        ) : (
          displayedOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-400">অর্ডার আইডি:</span>
                  <p className="font-mono text-xs font-bold text-slate-800">{ord.id}</p>
                  <span className="text-[11px] text-slate-400">{formatBanglaDate(ord.createdAt)}</span>
                </div>
                <div>{getStatusBadge(ord.status)}</div>
              </div>

              {/* Items List in order */}
              <div className="space-y-2">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-contain bg-slate-50 border rounded-lg p-1"
                      />
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-slate-400">
                          {formatPrice(item.price)} × {toBanglaNumber(item.quantity)}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total & Delivery Address */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-500">
                  <span className="font-semibold text-slate-700">ডেলিভারি ঠিকানা:</span>{' '}
                  {ord.shippingAddress?.fullAddress}, {ord.shippingAddress?.upazila},{' '}
                  {ord.shippingAddress?.district} ({ord.shippingAddress?.phone})
                </div>
                <div className="text-sm font-black text-slate-900">
                  মোট: <span className="text-emerald-700">{formatPrice(ord.totalPrice)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
