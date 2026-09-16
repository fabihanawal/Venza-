export interface Product {
  id: string;
  name: string;
  category: string; // category slug or name
  categoryName?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  description: string;
  specs: Record<string, string>;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isFlashSale: boolean;
  createdAt: number;
  brand?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  description?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  district: string; // e.g., নওগাঁ
  upazila: string; // e.g., বদলগাছী
  fullAddress: string;
  notes?: string;
}

export interface Order {
  id: string;
  userId?: string | null;
  guestInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: ShippingAddress;
  createdAt: number;
  trackingNumber?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses?: ShippingAddress[];
  createdAt?: number;
}

export interface BlogComment {
  id: string;
  postId: string;
  userId?: string | null;
  guestName: string;
  userEmail?: string;
  text: string;
  createdAt: number;
  approved: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: number;
  readingTime?: string;
}

export interface AdSlotConfig {
  id: string;
  title: string;
  image: string;
  link: string;
  sponsorName: string;
  active: boolean;
  position: 'productGrid' | 'sidebar' | 'blogList' | 'footerTop';
}

export interface SiteSettings {
  announcementBar: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  heroBanners: {
    id: string;
    title: string;
    subtitle: string;
    badge: string;
    buttonText: string;
    link: string;
    image: string;
    active: boolean;
  }[];
  flashSale: {
    enabled: boolean;
    title: string;
    endDate: string; // ISO date string
    discountBadge: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    whatsapp: string;
  };
  contactInfo: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    locationNote: string;
  };
  adSlots: {
    productGridEnabled: boolean;
    sidebarEnabled: boolean;
    blogListEnabled: boolean;
    slots: AdSlotConfig[];
  };
}

export interface CartItem extends OrderItem {}
