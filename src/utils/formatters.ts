// Bangla numeral converter
export const toBanglaNumber = (num: number | string | undefined | null): string => {
  if (num === undefined || num === null) return '০';
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => banglaDigits[parseInt(d, 10)]);
};

// Format currency in BDT ৳
export const formatPrice = (amount: number): string => {
  const formatted = new Intl.NumberFormat('en-IN').format(amount);
  return `৳${toBanglaNumber(formatted)}`;
};

// Calculate percentage discount
export const calculateDiscount = (price: number, discountPrice?: number): number => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

// Sanitize string to prevent basic XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
};

// Format timestamps into Bangla readable date
export const formatBanglaDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const monthsBangla = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const day = toBanglaNumber(date.getDate());
  const month = monthsBangla[date.getMonth()];
  const year = toBanglaNumber(date.getFullYear());
  return `${day} ${month}, ${year}`;
};
