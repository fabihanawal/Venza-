import React from 'react';
import { Star, ShoppingCart, Flame, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, calculateDiscount, toBanglaNumber } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { setSelectedProductId, setActiveView } = useStore();

  const discount = calculateDiscount(product.price, product.discountPrice);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setActiveView('products');
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {toBanglaNumber(discount)}% ছাড়
          </span>
        )}
        {product.isFlashSale && (
          <span className="bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Flame className="w-3 h-3 fill-slate-900" />
            ফ্ল্যাশ সেল
          </span>
        )}
      </div>

      {/* Stock status badge */}
      {product.stock <= 3 && product.stock > 0 && (
        <span className="absolute top-2.5 right-2.5 z-10 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
          মাত্র {toBanglaNumber(product.stock)}টি বাকি!
        </span>
      )}

      {/* Product Image */}
      <div 
        onClick={handleCardClick}
        className="relative pt-[85%] bg-slate-50 cursor-pointer overflow-hidden group-hover:bg-slate-100/50 transition-colors"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Quick view button overlay on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            বিস্তারিত দেখুন
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{product.categoryName || product.category}</span>
            {product.brand && <span className="font-semibold text-slate-600">{product.brand}</span>}
          </div>

          {/* Product Name */}
          <h3 
            onClick={handleCardClick}
            className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-2 cursor-pointer mb-2"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{toBanglaNumber(product.rating)}</span>
            <span className="text-[11px] text-slate-400">({toBanglaNumber(product.reviewsCount)} রিভিউ)</span>
          </div>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-extrabold text-emerald-700">
              {formatPrice(product.discountPrice || product.price)}
            </div>
            {product.discountPrice && (
              <div className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </div>
            )}
          </div>

          <button
            id={`add-to-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            disabled={product.stock <= 0}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:bg-slate-200 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
            title="কার্টে যোগ করুন"
            aria-label="কার্টে যোগ করুন"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
