import { Category, Product, BlogPost, SiteSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'মোবাইল ও ট্যাব', slug: 'mobile-tab', icon: 'Smartphone', productCount: 14, description: 'সেরা ব্র্যান্ডের স্মার্টফোন ও আধুনিক ট্যাবলেট' },
  { id: 'cat-2', name: 'ল্যাপটপ ও কম্পিউটার', slug: 'laptop-pc', icon: 'Laptop', productCount: 9, description: 'গেমিং ও অফিসিয়াল ল্যাপটপ এবং ডেক্সটপ এক্সেসরিজ' },
  { id: 'cat-3', name: 'অডিও ও হেডফোন', slug: 'audio-headphones', icon: 'Headphones', productCount: 18, description: 'টিডব্লিউএস ইয়ারবাডস, নেকব্যান্ড ও ব্লুটুথ স্পিকার' },
  { id: 'cat-4', name: 'স্মার্টওয়াচ ও গ্যাজেট', slug: 'smartwatch-gadgets', icon: 'Watch', productCount: 22, description: 'স্মার্ট ফিটনেস ট্র্যাকার, ক্যামেরা ও নিত্যদিনের গ্যাজেট' },
  { id: 'cat-5', name: 'অফার ও ফ্ল্যাশ সেল', slug: 'flash-sale', icon: 'Flame', productCount: 11, description: 'সীমিত সময়ের বিশেষ ডিসকাউন্ট অফার' },
  { id: 'cat-6', name: 'পাওয়ার ব্যাংক ও চার্জার', slug: 'power-charging', icon: 'BatteryCharging', productCount: 16, description: 'ফাস্ট চার্জার, কেবল ও হাই ক্যাপাসিটি পাওয়ার ব্যাংক' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Realme Buds Air 6 Pro ANC TWS',
    category: 'audio-headphones',
    categoryName: 'অডিও ও হেডফোন',
    price: 4990,
    discountPrice: 4250,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 15,
    description: '৫০dB ডিপ হাইব্রিড অ্যাক্টিভ নয়েজ ক্যান্সেলেশন, হাই-রেস এলডিএসি অডিও কোডেক, ডুয়াল ড্রাইভার সাউন্ড এবং ৪০ ঘণ্টার সুপার ব্যাটারি লাইফ।',
    specs: {
      'নয়েজ ক্যান্সেলেশন': '50dB Active Noise Cancellation',
      'ব্যাটারি ব্যাকআপ': '৪০ ঘণ্টা পর্যন্ত (কেস সহ)',
      'কানেক্টিভিটি': 'Bluetooth 5.3',
      'ড্রাইভার': '11mm Bass Driver + 6mm Tweeter',
      'ওয়াটার রেজিস্ট্যান্স': 'IPX5 রেটিং'
    },
    rating: 4.8,
    reviewsCount: 34,
    isFeatured: true,
    isFlashSale: true,
    createdAt: Date.now() - 86400000 * 2,
    brand: 'Realme'
  },
  {
    id: 'prod-2',
    name: 'Amazfit GTS 4 Mini স্মার্টওয়াচ',
    category: 'smartwatch-gadgets',
    categoryName: 'স্মার্টওয়াচ ও গ্যাজেট',
    price: 7499,
    discountPrice: 6590,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 8,
    description: '১.৬৫ ইঞ্চি HD অ্যামোলেড ডিসপ্লে, আল্ট্রা-স্লিম মেটাল ডিজাইন, বিল্ট-ইন ৫টি স্যাটেলাইট পজিশনিং জিপিএস এবং ১৫ দিনের লং লাস্টিং ব্যাটারি লাইফ।',
    specs: {
      'ডিসপ্লে': '1.65" AMOLED Always-on Display',
      'ব্যাটারি': '15 Days Battery Life',
      'জিপিএস': 'Built-in 5 Satellite Positioning',
      'সেন্সর': 'BioTracker 3.0 PPG Biometric',
      'স্পোর্টস মোড': '120+ Sports Modes'
    },
    rating: 4.9,
    reviewsCount: 42,
    isFeatured: true,
    isFlashSale: true,
    createdAt: Date.now() - 86400000 * 3,
    brand: 'Amazfit'
  },
  {
    id: 'prod-3',
    name: 'Xiaomi 67W HyperCharge ফাস্ট চার্জার কম্বো',
    category: 'power-charging',
    categoryName: 'পাওয়ার ব্যাংক ও চার্জার',
    price: 1850,
    discountPrice: 1550,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 25,
    description: 'অরিজিনাল শাওমি ৬৭ ওয়াট টার্বো ফাস্ট চার্জার সাথে ৬A টাইপ-সি কেবল। নিরাপদ চার্জিং ও ওভারহিট প্রতিরোধক স্মার্ট চিপসেট।',
    specs: {
      'আউটপুট': '67W Max (5V-3A / 9V-3A / 11V-6.1A / 20V-3.25A)',
      'কেবল': 'Original 6A Fast Data Cable Included',
      'প্রোটেকশন': 'Over-voltage, Over-temperature, Short-circuit'
    },
    rating: 4.7,
    reviewsCount: 19,
    isFeatured: false,
    isFlashSale: true,
    createdAt: Date.now() - 86400000 * 4,
    brand: 'Xiaomi'
  },
  {
    id: 'prod-4',
    name: 'Redmi Note 13 Pro 4G (8GB/256GB)',
    category: 'mobile-tab',
    categoryName: 'মোবাইল ও ট্যাব',
    price: 28999,
    discountPrice: 26490,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02596?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 6,
    description: '২০০ মেগাপিক্সেল OIS আল্ট্রা-ক্লিয়ার ক্যামেরা, ১২০Hz অ্যামোলেড ডিসপ্লে, হেলিয়ো জি৯৯ আল্ট্রা প্রসেসর এবং ৫০০০mAh ব্যাটারি সাথে ৬৭ ওয়াট ফাস্ট চার্জিং।',
    specs: {
      'প্রসেসর': 'MediaTek Helio G99-Ultra (6nm)',
      'ক্যামেরা': '200MP Main with OIS + 8MP Ultra-wide + 2MP Macro',
      'ডিসপ্লে': '6.67" FHD+ AMOLED 120Hz',
      'ব্যাটারি': '5000mAh with 67W Turbo Charge',
      'র‍্যাম ও রম': '8GB RAM + 256GB Storage'
    },
    rating: 4.9,
    reviewsCount: 68,
    isFeatured: true,
    isFlashSale: false,
    createdAt: Date.now() - 86400000 * 5,
    brand: 'Redmi'
  },
  {
    id: 'prod-5',
    name: 'Logitech MX Master 3S ওয়্যারলেস মাউস',
    category: 'laptop-pc',
    categoryName: 'ল্যাপটপ ও কম্পিউটার',
    price: 11500,
    discountPrice: 10400,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 4,
    description: '৮০০০ ডিপিআই এনিহোয়ার সেন্সর, ৯০% সাইলেন্ট ক্লিকস, ম্যাগস্পিড ইলেক্ট্রোম্যাগনেটিক স্ক্রোলিং এবং টাইপ-সি কুইক চার্জিং।',
    specs: {
      'সেন্সর': 'Darkfield high precision (8000 DPI)',
      'ক্লিক': 'Quiet Clicks (90% less noise)',
      'স্ক্রোলিং': 'MagSpeed electromagnetic scrolling',
      'কানেকশন': 'Bluetooth Low Energy & Logi Bolt USB'
    },
    rating: 5.0,
    reviewsCount: 14,
    isFeatured: true,
    isFlashSale: false,
    createdAt: Date.now() - 86400000 * 6,
    brand: 'Logitech'
  },
  {
    id: 'prod-6',
    name: 'Remax RPP-296 20000mAh ফাস্ট পাওয়ার ব্যাংক',
    category: 'power-charging',
    categoryName: 'পাওয়ার ব্যাংক ও চার্জার',
    price: 1850,
    discountPrice: 1490,
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 30,
    description: '২২.৫ ওয়াট ও ২০ ওয়াট পিডি ফাস্ট চার্জিং সমর্থন, ডুয়াল আউটপুট পোর্ট ও এলইডি ডিজিটাল ডিসপ্লে। ভ্রমণের জন্য উপযুক্ত স্লিম ডিজাইন।',
    specs: {
      'ক্যাপাসিটি': '20,000mAh Polymer Battery',
      'আউটপুট': '22.5W Super Charge / 20W PD Fast Charge',
      'ইনপুট': 'Type-C & Micro USB Dual Input',
      'ডিসপ্লে': 'LED Digital Percentage Display'
    },
    rating: 4.6,
    reviewsCount: 29,
    isFeatured: false,
    isFlashSale: true,
    createdAt: Date.now() - 86400000 * 7,
    brand: 'Remax'
  },
  {
    id: 'prod-7',
    name: 'JBL Flip 6 পোর্টেবল ওয়াটারপ্রুফ ব্লুটুথ স্পিকার',
    category: 'audio-headphones',
    categoryName: 'অডিও ও হেডফোন',
    price: 13500,
    discountPrice: 11990,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 5,
    description: 'টু-ওয়ে স্পিকার সিস্টেম, ক্রিস্টাল ক্লিয়ার ডিটেইল্ড সাউন্ড ও ডিপ ব্যাস। ১২ ঘণ্টার প্লেব্যাক এবং IP67 ডাস্ট ও ওয়াটারপ্রুফ বিল্ড।',
    specs: {
      'সাউন্ড আউটপুট': '20W RMS Woofer + 10W RMS Tweeter',
      'ব্যাটারি লাইফ': '12 Hours Playtime',
      'ওয়াটারপ্রুফ': 'IP67 Dustproof & Waterproof',
      'ফিচার': 'PartyBoost support'
    },
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: true,
    isFlashSale: false,
    createdAt: Date.now() - 86400000 * 8,
    brand: 'JBL'
  },
  {
    id: 'prod-8',
    name: 'Baseus 65W GaN5 Pro ফাস্ট চার্জার (৩ পোর্ট)',
    category: 'power-charging',
    categoryName: 'পাওয়ার ব্যাংক ও চার্জার',
    price: 2950,
    discountPrice: 2590,
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 12,
    description: 'আধুনিক GaN5 প্রযুক্তি, একসাথে ৩টি ডিভাইস চার্জ করার সুবিধা। ল্যাপটপ, ট্যাবলেট ও স্মার্টফোনের জন্য কমপ্যাক্ট সাইজ।',
    specs: {
      'আউটপুট': '65W Max USB-C1 + USB-C2 + USB-A',
      'প্রযুক্তি': 'GaN5 Pro Technology',
      'ওজন': 'Ultra light & portable',
      'কমপ্যাটিবিলিটি': 'MacBook, iPhone, Samsung, Xiaomi'
    },
    rating: 4.8,
    reviewsCount: 22,
    isFeatured: false,
    isFlashSale: false,
    createdAt: Date.now() - 86400000 * 9,
    brand: 'Baseus'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'স্মার্টফোন কেনার আগে ২০২৬ সালে যে ৫টি বিষয় যাচাই করবেন',
    content: `আজকের দ্রুত পরিবর্তনশীল প্রযুক্তির যুগে নতুন স্মার্টফোন নির্বাচন করা অনেক সময় কঠিন মনে হতে পারে। বাজেট যাই হোক না কেন, দীর্ঘমেয়াদী স্থায়িত্ব ও কার্যক্ষমতার জন্য নিচের পয়েন্টগুলো যাচাই করে নেওয়া জরুরি:\n\n১. প্রসেসর ও ম্যানুফ্যাকচারিং নোড: প্রসেসর যত ছোট ন্যানোমিটারে (৪nm বা ৫nm) তৈরি, ফোনের চার্জ তত বেশি টেকসই হবে ও গরম কম হবে।\n\n২. ডিসপ্লে রিফ্রেশ রেট ও প্যানেল কোয়ালিটি: সবসময় FHD+ রেজোলিউশন ও মিনিমাম ১২০Hz AMOLED ডিসপ্লেকে অগ্রাধিকার দিন।\n\n৩. ক্যামেরার OIS (Optical Image Stabilization): মেগাপিক্সেল সংখ্যার চেয়েও লেন্সের সেন্সর সাইজ এবং OIS থাকাটা কম আলোতে ঝকঝকে ছবি তুলতে বেশি সহায়ক।\n\n৪. সফটওয়্যার আপডেট পলিসি: ফোন কেনার আগে ব্র্যান্ড অন্তত ৩-৪ বছর সিকিউরিটি ও অ্যান্ড্রয়েড ওএস আপডেট দেবে কিনা তা চেক করে নিন।\n\n৫. ব্যাটারি ক্যাপাসিটি ও চার্জিং স্পিড: অন্তত ৫০০০mAh ব্যাটারি এবং অন্তত ৩৩W বা ৬৭W ফাস্ট চার্জিং সমর্থন আছে কিনা দেখে নেওয়া উচিত।\n\nবদলগাছী ও নওগাঁর গ্রাহকদের জন্য ভেনজা (Venza) সরাসরি অফিশিয়াল ও যাচাইকৃত জেনুইন গ্যাজেট সরবরাহ করছে।`,
    excerpt: 'বাজেট যাই হোক, সঠিক প্রসেসর, ওআইএস ক্যামেরা ও ডিসপ্লে টেকনোলজি বাছাই করার দরকারি গাইডলাইন।',
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02596?w=900&auto=format&fit=crop&q=80',
    tags: ['স্মার্টফোন', 'গ্যাজেট গাইড', 'প্রযুক্তি টিপস'],
    authorId: 'admin',
    authorName: 'ভেনজা টেক টিম',
    createdAt: Date.now() - 86400000 * 3,
    readingTime: '৪ মিনিট'
  },
  {
    id: 'blog-2',
    title: 'পাওয়ার ব্যাংকের আয়ু বাড়ানোর সহজ উপায় ও নিরাপদ চার্জিং',
    content: `স্মার্টফোন বা অন্যান্য গ্যাজেটের জন্য পাওয়ার ব্যাংক আমাদের দৈনন্দিন জীবনের অবিচ্ছেদ্য অংশ। কিন্তু ভুল ব্যবহারের কারণে অনেক সময় পাওয়ার ব্যাংকের কার্যক্ষমতা দ্রুত নষ্ট হয়ে যায়।\n\nটিপস:\n১. কখনোই পাওয়ার ব্যাংক পুরোপুরি শূন্য (০%) করবেন না। ২০% থাকা অবস্থায় চার্জে দিন।\n২. অতিরিক্ত গরম বা সরাসরি রোদে রাখবেন না। লিথিয়াম পলিমার ব্যাটারি অতিরিক্ত তাপে ফুলে যাওয়ার ঝুঁকি থাকে।\n৩. সবসময় ভালো মানের অরিজিনাল কেবল দিয়ে পাওয়ার ব্যাংক চার্জ করুন।\n৪. প্যাশ-থ্রু চার্জিং পরিহার করুন (অর্থাৎ পাওয়ার ব্যাংক নিজে চার্জে থাকা অবস্থায় অন্য ডিভাইস চার্জ না দেওয়া ভালো)।`,
    excerpt: 'পাওয়ার ব্যাংকের ব্যাটারি হেলথ দীর্ঘস্থায়ী করার প্রয়োজনীয় পরামর্শ ও নিরাপত্তা সতর্কতা।',
    coverImage: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=900&auto=format&fit=crop&q=80',
    tags: ['পাওয়ার ব্যাংক', 'ব্যাটারি কেয়ার', 'গ্যাজেট সিকিউরিটি'],
    authorId: 'admin',
    authorName: 'ইঞ্জিনিয়ার রেজওয়ান',
    createdAt: Date.now() - 86400000 * 7,
    readingTime: '৩ মিনিট'
  },
  {
    id: 'blog-3',
    title: 'টিডব্লিউএস ইয়ারবাডসে এএনসি (ANC) বনাম ইএনসি (ENC): পার্থক্য কী?',
    content: `ইয়ারবাডস কেনার সময় আমরা প্রায়ই ANC এবং ENC এই দুটো টার্ম দেখে বিভ্রান্ত হই।\n\n- ANC (Active Noise Cancellation): এটি আপনার নিজের শোনার অভিজ্ঞতার জন্য। বাইরের গাড়ির হর্ন বা কোলাহলকে বিপরীত সাউন্ডওয়েভ তৈরি করে বাতিল করে দেয়, ফলে গান বা অডিও ক্রিস্টাল ক্লিয়ার শোনা যায়।\n\n- ENC (Environmental Noise Cancellation): এটি মাইক্রোফোনের জন্য কাজ করে। যখন আপনি ফোনে কথা বলেন, তখন আপনার চারপাশের আওয়াজ ফিল্টার করে শুধু আপনার কণ্ঠস্বর অপর পাশের শ্রোতার কাছে পৌঁছে দেয়।\n\nঅফিস কলিং বা ট্রাভেলিংয়ের জন্য উভয় ফিচার থাকা মডেল বেছে নেওয়াই সেরা।`,
    excerpt: 'ইয়ারফোন কেনার আগে নয়েজ ক্যান্সেলেশনের সঠিক প্রযুক্তি সম্পর্কে স্বচ্ছ ধারণা নিন।',
    coverImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900&auto=format&fit=crop&q=80',
    tags: ['অডিও', 'ইয়ারবাডস', 'ANC প্রযুক্তি'],
    authorId: 'admin',
    authorName: 'ভেনজা অডিও বিশেষজ্ঞ',
    createdAt: Date.now() - 86400000 * 12,
    readingTime: '৫ মিনিট'
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  announcementBar: {
    enabled: true,
    text: '⚡ ভেনজা গ্যাজেট স্টোর — বদলগাছী, নওগাঁ। যেকোনো অর্ডারে ফ্রি ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা!',
    link: '#flash-sale'
  },
  heroBanners: [
    {
      id: 'banner-1',
      title: 'প্রিমিয়াম গ্যাজেট ও আধুনিক ইলেকট্রনিক্স',
      subtitle: '১০০% আসল পণ্যের নিশ্চয়তা সহ সরাসরি আপনার দোরগোড়ায়। নওগাঁ ও বদলগাছীর বিশ্বস্ত ঠিকানা।',
      badge: 'নতুন আগমন ২০২৬',
      buttonText: 'অফার দেখুন',
      link: '#products',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80',
      active: true
    },
    {
      id: 'banner-2',
      title: 'স্মার্ট অ্যাক্সেসরিজ মেগা ফ্ল্যাশ সেল',
      subtitle: 'স্মার্টওয়াচ, ইয়ারবাডস ও ফাস্ট চার্জারে বিশেষ ২০% থেকে ৩৫% মূল্যছাড়। সীমিত সময়ের অফার!',
      badge: 'সীমিত স্টক',
      buttonText: 'এখনই কিনুন',
      link: '#flash-sale',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&auto=format&fit=crop&q=80',
      active: true
    }
  ],
  flashSale: {
    enabled: true,
    title: 'ধামাকা ফ্ল্যাশ সেল ২০২৬',
    endDate: new Date(Date.now() + 86400000 * 3 + 3600000 * 14).toISOString(),
    discountBadge: 'সর্বোচ্চ ৪০% পর্যন্ত ছাড়'
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/8801700000000'
  },
  contactInfo: {
    phone: '০১৭০০-০০০০০০ / ০১৮০০-০০০০০০',
    whatsapp: '+৮৮০১৭০০০০০০০০',
    email: 'rstsbd@gmail.com',
    address: 'বদলগাছী বাজার প্রধান সড়ক, ডাকঘর: বদলগাছী, জেলা: নওগাঁ - ৬৫৭০',
    locationNote: 'বদলগাছী উপজেলা চত্বর সংলগ্ন ভেনজা ইলেকট্রনিক্স শপ'
  },
  adSlots: {
    productGridEnabled: true,
    sidebarEnabled: true,
    blogListEnabled: true,
    slots: [
      {
        id: 'ad-1',
        title: 'নওগাঁ লোকাল ইন্টারনেট সার্ভিস - আল্ট্রাফাস্ট ফাইবার ব্রডব্যান্ড',
        image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
        link: 'https://wa.me/8801700000000',
        sponsorName: 'নওগাঁ ফাইবার নেট',
        active: true,
        position: 'productGrid'
      },
      {
        id: 'ad-2',
        title: 'বদলগাছী টেক রিপেয়ার হাব - অরিজিনাল ডিসপ্লে ও ব্যাটারি প্রতিস্থাপন',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        link: 'https://wa.me/8801700000000',
        sponsorName: 'বদলগাছী ইলেকট্রো কেয়ার',
        active: true,
        position: 'blogList'
      },
      {
        id: 'ad-3',
        title: 'অফিসিয়াল গ্যাজেট ওয়ারেন্টি পার্টনার - ভেনজা কেয়ার প্লাস',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
        link: '#',
        sponsorName: 'ভেনজা কেয়ার',
        active: true,
        position: 'sidebar'
      }
    ]
  }
};
