import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Category, BlogPost, SiteSettings } from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_BLOG_POSTS, 
  INITIAL_SITE_SETTINGS 
} from '../data/initialData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  blogPosts: BlogPost[];
  siteSettings: SiteSettings;
  loading: boolean;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: 'home' | 'products' | 'cart' | 'checkout' | 'blog' | 'blogDetail' | 'admin' | 'orders';
  setActiveView: (view: 'home' | 'products' | 'cart' | 'checkout' | 'blog' | 'blogDetail' | 'admin' | 'orders') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedBlogPostId: string | null;
  setSelectedBlogPostId: (id: string | null) => void;
  syncInitialSeedData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType>({
  products: [],
  categories: [],
  blogPosts: [],
  siteSettings: INITIAL_SITE_SETTINGS,
  loading: true,
  selectedCategory: null,
  setSelectedCategory: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  activeView: 'home',
  setActiveView: () => {},
  selectedProductId: null,
  setSelectedProductId: () => {},
  selectedBlogPostId: null,
  setSelectedBlogPostId: () => {},
  syncInitialSeedData: async () => {},
});

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'home' | 'products' | 'cart' | 'checkout' | 'blog' | 'blogDetail' | 'admin' | 'orders'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);

  // Sync initial seed data to Firestore if empty or on admin request
  const syncInitialSeedData = async () => {
    try {
      // 1. Categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
      }
      // 2. Products
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
      }
      // 3. Blog Posts
      for (const post of INITIAL_BLOG_POSTS) {
        await setDoc(doc(db, 'blogPosts', post.id), post, { merge: true });
      }
      // 4. Site Settings
      await setDoc(doc(db, 'siteSettings', 'global'), INITIAL_SITE_SETTINGS, { merge: true });
    } catch (err) {
      console.warn('Initial seed sync to Firestore skipped (using client-side data):', err);
    }
  };

  useEffect(() => {
    // 1. Subscribe to categories
    const unsubscribeCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
        setCategories(loaded);
      }
    }, (err) => console.warn('Categories snapshot listener error, using default:', err));

    // 2. Subscribe to products
    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
        setProducts(loaded);
      }
    }, (err) => console.warn('Products snapshot listener error, using default:', err));

    // 3. Subscribe to blogPosts
    const unsubscribeBlog = onSnapshot(collection(db, 'blogPosts'), (snapshot) => {
      if (!snapshot.empty) {
        const loaded = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost));
        setBlogPosts(loaded);
      }
    }, (err) => console.warn('Blog snapshot listener error, using default:', err));

    // 4. Subscribe to siteSettings
    const unsubscribeSettings = onSnapshot(doc(db, 'siteSettings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSiteSettings(docSnap.data() as SiteSettings);
      }
      setLoading(false);
    }, (err) => {
      console.warn('Site settings snapshot listener error, using default:', err);
      setLoading(false);
    });

    // Check if firestore has products, if completely empty, trigger bootstrap sync
    getDocs(collection(db, 'products')).then((snapshot) => {
      if (snapshot.empty) {
        syncInitialSeedData();
      }
    }).catch((e) => console.warn('Bootstrap check:', e));

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
      unsubscribeBlog();
      unsubscribeSettings();
    };
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        blogPosts,
        siteSettings,
        loading,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        selectedProductId,
        setSelectedProductId,
        selectedBlogPostId,
        setSelectedBlogPostId,
        syncInitialSeedData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
