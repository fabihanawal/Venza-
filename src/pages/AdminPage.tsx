import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Package, 
  ShoppingCart, 
  FileText, 
  Settings, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  Upload, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  setDoc,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, Order, BlogPost, BlogComment, UserProfile, SiteSettings } from '../types';
import { formatPrice, formatBanglaDate, toBanglaNumber, sanitizeInput } from '../utils/formatters';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const { products, categories, blogPosts, siteSettings, setActiveView, syncInitialSeedData } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'blog' | 'users' | 'settings'>('dashboard');

  // Firestore listeners for Admin data
  const [orders, setOrders] = useState<Order[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Product edit/create state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Blog post edit/create state
  const [editingBlogPost, setEditingBlogPost] = useState<Partial<BlogPost> | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  useEffect(() => {
    if (!isAdmin) return;

    // Listen to all orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const ords = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
      ords.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(ords);
    });

    // Listen to all comments
    const unsubComments = onSnapshot(collection(db, 'blogComments'), (snap) => {
      const cmts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogComment));
      cmts.sort((a, b) => b.createdAt - a.createdAt);
      setComments(cmts);
    });

    // Listen to all users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      const usrs = snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile));
      setUsersList(usrs);
    });

    return () => {
      unsubOrders();
      unsubComments();
      unsubUsers();
    };
  }, [isAdmin]);

  useEffect(() => {
    setSettingsForm(siteSettings);
  }, [siteSettings]);

  // If user is not admin
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">এডমিন এক্সেস সংরক্ষিত</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          এই পেজটি শুধুমাত্র ভেনজা (Venza) স্টোর এডমিনদের জন্য নির্ধারিত। আপনার নির্ধারিত এডমিন ইমেইল (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-700">rstsbd@gmail.com</code>) দিয়ে গুগল সাইন-ইন সম্পন্ন করুন।
        </p>
        <div className="pt-3 flex justify-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
          >
            হোমপেজে ফিরে যান
          </button>
          <button
            onClick={signInWithGoogle}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            এডমিন হিসেবে সাইন ইন
          </button>
        </div>
      </div>
    );
  }

  // Calculate Metrics for Dashboard
  const totalSales = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.totalPrice : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;
  const totalProductsCount = products.length;

  // 1. PRODUCT HANDLERS
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    try {
      const prodData = {
        name: sanitizeInput(editingProduct.name),
        category: editingProduct.category || 'mobile-tab',
        categoryName: categories.find((c) => c.slug === editingProduct.category)?.name || 'গ্যাজেট',
        price: Number(editingProduct.price),
        discountPrice: editingProduct.discountPrice ? Number(editingProduct.discountPrice) : undefined,
        images: editingProduct.images?.length ? editingProduct.images : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
        stock: Number(editingProduct.stock || 10),
        description: sanitizeInput(editingProduct.description || ''),
        specs: editingProduct.specs || {},
        rating: editingProduct.rating || 5.0,
        reviewsCount: editingProduct.reviewsCount || 1,
        isFeatured: Boolean(editingProduct.isFeatured),
        isFlashSale: Boolean(editingProduct.isFlashSale),
        brand: sanitizeInput(editingProduct.brand || 'Venza'),
        createdAt: editingProduct.createdAt || Date.now(),
      };

      if (editingProduct.id) {
        await updateDoc(doc(db, 'products', editingProduct.id), prodData);
        showNotification('পণ্য সফলভাবে আপডেট করা হয়েছে!');
      } else {
        await addDoc(collection(db, 'products'), prodData);
        showNotification('নতুন পণ্য সফলভাবে যুক্ত করা হয়েছে!');
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Save product error:', err);
      showNotification('পণ্য সংরক্ষণ করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত এই পণ্যটি মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      showNotification('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে।');
    } catch (err) {
      console.error(err);
    }
  };

  // Image Upload helper (supports Firebase Storage or direct image URL fallback)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      const uploadRes = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadRes.ref);
      setEditingProduct((prev) => ({
        ...prev,
        images: [url, ...(prev?.images || [])],
      }));
      showNotification('ছবি আপলোড সম্পন্ন হয়েছে!');
    } catch (err) {
      console.warn('Firebase Storage direct upload note (using object URL fallback):', err);
      // Create local data url for rapid prototyping
      const reader = new FileReader();
      reader.onload = (re) => {
        if (re.target?.result) {
          setEditingProduct((prev) => ({
            ...prev,
            images: [re.target!.result as string, ...(prev?.images || [])],
          }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  // 2. ORDER STATUS HANDLER
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      showNotification(`অর্ডার স্ট্যাটাস আপডেট: ${newStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  // 3. BLOG HANDLERS
  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlogPost?.title || !editingBlogPost?.content) return;

    try {
      const postData = {
        title: sanitizeInput(editingBlogPost.title),
        content: sanitizeInput(editingBlogPost.content),
        excerpt: sanitizeInput(editingBlogPost.excerpt || ''),
        coverImage: editingBlogPost.coverImage || 'https://images.unsplash.com/photo-1511707171634-5f897ff02596?w=900&auto=format&fit=crop&q=80',
        tags: editingBlogPost.tags || ['গ্যাজেট'],
        authorId: user?.uid || 'admin',
        authorName: user?.displayName || 'ভেনজা টেক টিম',
        createdAt: editingBlogPost.createdAt || Date.now(),
        readingTime: editingBlogPost.readingTime || '৩ মিনিট',
      };

      if (editingBlogPost.id) {
        await updateDoc(doc(db, 'blogPosts', editingBlogPost.id), postData);
        showNotification('ব্লগ পোস্ট আপডেট সম্পন্ন!');
      } else {
        await addDoc(collection(db, 'blogPosts'), postData);
        showNotification('নতুন ব্লগ পোস্ট প্রকাশিত হয়েছে!');
      }
      setIsBlogModalOpen(false);
      setEditingBlogPost(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!window.confirm('এই ব্লগ পোস্টটি কি মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      showNotification('ব্লগ পোস্টটি মুছে ফেলা হয়েছে।');
    } catch (err) {
      console.error(err);
    }
  };

  // Comment Moderation
  const handleApproveComment = async (commentId: string, approved: boolean) => {
    try {
      await updateDoc(doc(db, 'blogComments', commentId), { approved });
      showNotification(approved ? 'মন্তব্যটি অ্যাপ্রুভ করা হয়েছে!' : 'মন্তব্যটি বাতিল করা হয়েছে।');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteDoc(doc(db, 'blogComments', commentId));
      showNotification('মন্তব্যটি মুছে ফেলা হয়েছে।');
    } catch (err) {
      console.error(err);
    }
  };

  // 4. SETTINGS HANDLER
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'siteSettings', 'global'), settingsForm, { merge: true });
      showNotification('সাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ওয়েবসাইটে ফিরে যান</span>
          </button>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black">ভেনজা (Venza) এডমিন প্যানেল</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            বদলগাছী, নওগাঁ হাব • অ্যাডমিন: <span className="text-amber-300 font-bold">{user?.email}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={syncInitialSeedData}
            title="ডাটাবেস রিসিংক করুন"
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ডাটা সিংক</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Admin Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'products', label: `পণ্য ব্যবস্থাপনা (${toBanglaNumber(products.length)})`, icon: <Package className="w-4 h-4" /> },
          { id: 'orders', label: `অর্ডার ব্যবস্থাপনা (${toBanglaNumber(orders.length)})`, icon: <ShoppingCart className="w-4 h-4" /> },
          { id: 'blog', label: `ব্লগ ও কমেন্ট (${toBanglaNumber(blogPosts.length)})`, icon: <FileText className="w-4 h-4" /> },
          { id: 'users', label: 'ব্যবহারকারী তালিকা', icon: <Users className="w-4 h-4" /> },
          { id: 'settings', label: 'সাইট ও ব্যানার সেটিংস', icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-400">মোট বিক্রয় (বিক্রিত মূল্য)</span>
              <div className="text-2xl font-black text-slate-900">{formatPrice(totalSales)}</div>
              <p className="text-[11px] text-emerald-600 font-bold">✓ ডেলিভারি ও রানিং অর্ডার</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-400">মোট অর্ডার সংখ্যা</span>
              <div className="text-2xl font-black text-slate-900">{toBanglaNumber(totalOrdersCount)} টি</div>
              <p className="text-[11px] text-slate-500">{toBanglaNumber(pendingOrdersCount)} টি পেন্ডিং রয়েছে</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-400">মোট গ্যাজেট পণ্য</span>
              <div className="text-2xl font-black text-slate-900">{toBanglaNumber(totalProductsCount)} টি</div>
              <p className="text-[11px] text-slate-500">{toBanglaNumber(categories.length)} টি ক্যাটেগরি</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-semibold text-slate-400">ব্লগ কমেন্ট ও রিভিউ</span>
              <div className="text-2xl font-black text-slate-900">{toBanglaNumber(comments.length)} টি</div>
              <p className="text-[11px] text-amber-600 font-bold">
                {toBanglaNumber(comments.filter((c) => !c.approved).length)} টি মডারেশন বাকি
              </p>
            </div>
          </div>

          {/* Recent Orders table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">সাম্প্রতিক অর্ডারসমূহ</h3>
              <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-emerald-700 underline">
                সবগুলো দেখুন
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">অর্ডার আইডি</th>
                    <th className="py-2.5 px-3">গ্রাহকের নাম ও ফোন</th>
                    <th className="py-2.5 px-3">ঠিকানা</th>
                    <th className="py-2.5 px-3">মোট বিল</th>
                    <th className="py-2.5 px-3">পদ্ধতি</th>
                    <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{ord.id.substring(0, 8)}...</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{ord.shippingAddress?.fullName}</div>
                        <div className="text-slate-400">{ord.shippingAddress?.phone}</div>
                      </td>
                      <td className="py-3 px-3 max-w-[160px] truncate">
                        {ord.shippingAddress?.upazila}, {ord.shippingAddress?.district}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700">{formatPrice(ord.totalPrice)}</td>
                      <td className="py-3 px-3 uppercase text-[11px] font-semibold">{ord.paymentMethod}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-base">পণ্য তালিকা ও ইনভেন্টরি</h3>
              <p className="text-xs text-slate-500">পণ্য যোগ করুন, ডিসকাউন্ট ও স্টক পরিবর্তন করুন</p>
            </div>

            <button
              onClick={() => {
                setEditingProduct({
                  name: '',
                  category: 'mobile-tab',
                  price: 0,
                  stock: 10,
                  description: '',
                  specs: {},
                  images: [],
                  isFeatured: false,
                  isFlashSale: false,
                  brand: 'Venza',
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পণ্য যুক্ত করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">ছবি</th>
                  <th className="py-2.5 px-3">পণ্যের নাম</th>
                  <th className="py-2.5 px-3">ক্যাটেগরি</th>
                  <th className="py-2.5 px-3">মূল্য ও ছাড়</th>
                  <th className="py-2.5 px-3">স্টক</th>
                  <th className="py-2.5 px-3">ফ্ল্যাশ সেল</th>
                  <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60">
                    <td className="py-2 px-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-10 h-10 object-contain rounded-lg bg-slate-50 border p-1"
                      />
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 max-w-xs">{prod.name}</td>
                    <td className="py-2 px-3">{prod.categoryName || prod.category}</td>
                    <td className="py-2 px-3">
                      <div className="font-bold text-emerald-700">
                        {formatPrice(prod.discountPrice || prod.price)}
                      </div>
                      {prod.discountPrice && (
                        <div className="text-[10px] text-slate-400 line-through">
                          {formatPrice(prod.price)}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 font-semibold">
                      <span className={prod.stock <= 3 ? 'text-rose-600' : 'text-slate-800'}>
                        {toBanglaNumber(prod.stock)} টি
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      {prod.isFlashSale ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          সক্রিয়
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">না</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100"
                        title="সম্পাদনা"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base">সকল গ্রাহক অর্ডার</h3>
            <p className="text-xs text-slate-500">অর্ডার স্ট্যাটাস আপডেট করুন ও ডেলিভারি পরিচালনা করুন</p>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">এখনো কোনো অর্ডার নেই।</p>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">ID: {ord.id}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({formatBanglaDate(ord.createdAt)})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">স্ট্যাটাস পরিবর্তন:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                        className="bg-white border border-slate-300 rounded-lg text-xs font-bold px-2 py-1 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Pending">Pending (অপেক্ষমাণ)</option>
                        <option value="Confirmed">Confirmed (নিশ্চিত)</option>
                        <option value="Shipped">Shipped (ডেলিভারিতে)</option>
                        <option value="Delivered">Delivered (সম্পন্ন)</option>
                        <option value="Cancelled">Cancelled (বাতিল)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">গ্রাহক ও ঠিকানা:</p>
                      <p className="text-slate-600">নাম: {ord.shippingAddress?.fullName}</p>
                      <p className="text-slate-600">মোবাইল: {ord.shippingAddress?.phone}</p>
                      <p className="text-slate-600">
                        ঠিকানা: {ord.shippingAddress?.fullAddress}, {ord.shippingAddress?.upazila}, {ord.shippingAddress?.district}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">অর্ডার পণ্য ও মূল্য:</p>
                      <div className="space-y-1 mt-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                            <span>{it.name} (x{toBanglaNumber(it.quantity)})</span>
                            <span>{formatPrice(it.price * it.quantity)}</span>
                          </div>
                        ))}
                        <div className="pt-1 border-t border-slate-200 font-bold flex justify-between text-slate-900">
                          <span>মোট বিল ({ord.paymentMethod}):</span>
                          <span className="text-emerald-700">{formatPrice(ord.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BLOG & COMMENT MODERATION */}
      {activeTab === 'blog' && (
        <div className="space-y-6">
          {/* Post Management */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-base">টেক ব্লগ পোস্টসমূহ</h3>
                <p className="text-xs text-slate-500">রিভিউ ও টিপস আর্টিকেল যোগ বা এডিট করুন</p>
              </div>

              <button
                onClick={() => {
                  setEditingBlogPost({
                    title: '',
                    content: '',
                    tags: ['গ্যাজেট', 'টিপস'],
                    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02596?w=900&auto=format&fit=crop&q=80',
                    readingTime: '৩ মিনিট',
                  });
                  setIsBlogModalOpen(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ব্লগ পোস্ট লিখুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl border border-slate-200 flex gap-3">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{post.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{formatBanglaDate(post.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          setEditingBlogPost(post);
                          setIsBlogModalOpen(true);
                        }}
                        className="text-xs text-emerald-600 font-bold hover:underline"
                      >
                        সম্পাদনা
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleDeleteBlogPost(post.id)}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Moderation */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">মন্তব্য মডারেশন (অ্যাপ্রুভাল)</h3>
              <p className="text-xs text-slate-500">গ্রাহকদের মন্তব্য পর্যালোচনা করুন ও ওয়েবসাইটে প্রকাশের অনুমোদন দিন</p>
            </div>

            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">এখনো কোনো মন্তব্য জমা হয়নি।</p>
              ) : (
                comments.map((cmt) => (
                  <div key={cmt.id} className="p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{cmt.guestName}</span>
                        {cmt.userEmail && <span className="text-[10px] text-slate-400">({cmt.userEmail})</span>}
                        {cmt.approved ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            অ্যাপ্রুভড
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                            অপেক্ষমাণ
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700">{cmt.text}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!cmt.approved ? (
                        <button
                          onClick={() => handleApproveComment(cmt.id, true)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          অনুমোদন (Approve)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveComment(cmt.id, false)}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
                        >
                          অপ্রকাশিত করুন
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(cmt.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USERS LIST */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-black text-slate-900 text-base">রেজিস্টার্ড গ্রাহক ও এডমিন তালিকা</h3>
            <p className="text-xs text-slate-500">গুগল সাইন-ইন করা ব্যবহারকারীদের প্রোফাইল ও ভূমিকা</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">নাম</th>
                  <th className="py-2.5 px-3">ইমেইল</th>
                  <th className="py-2.5 px-3">ভূমিকা (Role)</th>
                  <th className="py-2.5 px-3">যোগদানের তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-2.5 px-3">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role === 'admin' ? '★ Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {u.createdAt ? formatBanglaDate(u.createdAt) : 'সাম্প্রতিক'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SITE & BANNER SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Announcement Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              অ্যানাউন্সমেন্ট বার (টপ নোটিফিকেশন)
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={settingsForm.announcementBar?.enabled}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcementBar: { ...settingsForm.announcementBar, enabled: e.target.checked },
                    })
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>অ্যানাউন্সমেন্ট বার সক্রিয় রাখুন</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">বার টেক্সট</label>
                <input
                  type="text"
                  value={settingsForm.announcementBar?.text}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      announcementBar: { ...settingsForm.announcementBar, text: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Social Links & Contact */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              যোগাযোগ ও সোশ্যাল মিডিয়া লিংক
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">মোবাইল ফোন নম্বর</label>
                <input
                  type="text"
                  value={settingsForm.contactInfo?.phone}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      contactInfo: { ...settingsForm.contactInfo, phone: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp লিংক</label>
                <input
                  type="text"
                  value={settingsForm.socialLinks?.whatsapp}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      socialLinks: { ...settingsForm.socialLinks, whatsapp: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">ফেসবুক পেইজ লিংক</label>
                <input
                  type="text"
                  value={settingsForm.socialLinks?.facebook}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">দোকানের সম্পূর্ণ ঠিকানা</label>
                <input
                  type="text"
                  value={settingsForm.contactInfo?.address}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      contactInfo: { ...settingsForm.contactInfo, address: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            সাইট সেটিংস সেভ করুন
          </button>
        </form>
      )}

      {/* PRODUCT CREATE/EDIT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct?.id ? 'পণ্য সম্পাদনা' : 'নতুন পণ্য যোগ'}
              </h3>
              <button
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">পণ্যের নাম *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ক্যাটেগরি *</label>
                  <select
                    value={editingProduct?.category || 'mobile-tab'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">নিয়মিত মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ডিসকাউন্ট অফার মূল্য (৳)</label>
                  <input
                    type="number"
                    value={editingProduct?.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ইনভেন্টরি স্টক *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.stock || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ছবি আপলোড (Firebase Storage / URL)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 text-slate-500"
                  />
                  {uploadingImage && <span className="text-emerald-600 animate-pulse">আপলোড হচ্ছে...</span>}
                </div>
                {editingProduct?.images?.[0] && (
                  <div className="mt-2 flex gap-2">
                    <img src={editingProduct.images[0]} alt="preview" className="w-12 h-12 rounded object-contain border p-1" />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">বিস্তারিত বিবরণ</label>
                <textarea
                  rows={3}
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.isFeatured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-slate-700">হোমপেজে ফিচার্ড পণ্য</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct?.isFlashSale || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFlashSale: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <span className="font-semibold text-amber-700">ফ্ল্যাশ সেল অফারে অন্তর্ভুক্ত</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG CREATE/EDIT MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingBlogPost?.id ? 'ব্লগ পোস্ট সম্পাদনা' : 'নতুন ব্লগ পোস্ট'}
              </h3>
              <button
                onClick={() => {
                  setIsBlogModalOpen(false);
                  setEditingBlogPost(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlogPost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">পোস্টের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={editingBlogPost?.title || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">কভার ছবির URL</label>
                <input
                  type="url"
                  value={editingBlogPost?.coverImage || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, coverImage: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">আর্টিকেল কনটেন্ট *</label>
                <textarea
                  rows={8}
                  required
                  value={editingBlogPost?.content || ''}
                  onChange={(e) => setEditingBlogPost({ ...editingBlogPost, content: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsBlogModalOpen(false);
                    setEditingBlogPost(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-xs"
                >
                  পোস্ট প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
