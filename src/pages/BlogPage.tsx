import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  User as UserIcon, 
  ArrowLeft, 
  Share2, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { BlogPost, BlogComment } from '../types';
import { formatBanglaDate, sanitizeInput } from '../utils/formatters';
import { NativeAdCard } from '../components/NativeAdCard';

export const BlogPage: React.FC = () => {
  const { blogPosts, selectedBlogPostId, setSelectedBlogPostId, siteSettings } = useStore();
  const { user, userProfile, isAdmin } = useAuth();

  const [commentName, setCommentName] = useState(userProfile?.name || user?.displayName || '');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activePost = selectedBlogPostId 
    ? blogPosts.find((p) => p.id === selectedBlogPostId)
    : null;

  // Fetch approved comments for active blog post
  useEffect(() => {
    if (!activePost) return;

    const q = query(
      collection(db, 'blogComments'),
      where('postId', '==', activePost.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allComments = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as BlogComment));
      // Show approved comments to public, all comments to admin
      const visible = isAdmin 
        ? allComments 
        : allComments.filter((c) => c.approved);
      setComments(visible);
    }, (err) => console.warn('Comments snapshot warning:', err));

    return () => unsubscribe();
  }, [activePost, isAdmin]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePost || !commentText.trim() || !commentName.trim()) return;

    try {
      await addDoc(collection(db, 'blogComments'), {
        postId: activePost.id,
        userId: user ? user.uid : null,
        guestName: sanitizeInput(commentName),
        userEmail: user?.email || '',
        text: sanitizeInput(commentText),
        createdAt: Date.now(),
        // Admins can comment directly approved; guests require admin moderation
        approved: isAdmin,
      });

      setCommentText('');
      setCommentSubmitted(true);
      setTimeout(() => setCommentSubmitted(false), 5000);
    } catch (err) {
      console.warn('Fallback local comment:', err);
      setCommentSubmitted(true);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // 1. SINGLE BLOG POST VIEW WITH COMMENTS
  if (activePost) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <button
          onClick={() => setSelectedBlogPostId(null)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল ব্লগে ফিরে যান</span>
        </button>

        {/* Post Article Header */}
        <article className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {activePost.tags[0] || 'গ্যাজেট রিভিউ'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activePost.readingTime || '৩ মিনিট'}
              </span>
              <span>•</span>
              <span>{formatBanglaDate(activePost.createdAt)}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1 rounded-full transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'কপি হয়েছে!' : 'শেয়ার করুন'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            {activePost.title}
          </h1>

          <div className="flex items-center gap-2.5 text-xs text-slate-600 pb-2 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
              <UserIcon className="w-4 h-4" />
            </div>
            <span>লেখক: <strong className="text-slate-800">{activePost.authorName}</strong></span>
          </div>

          {/* Cover Image */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100">
            <img
              src={activePost.coverImage}
              alt={activePost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Body */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {activePost.content}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            {activePost.tags.map((t, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                #{t}
              </span>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              মন্তব্য ও আলোচনা ({comments.length})
            </h3>
          </div>

          {/* Comment Form */}
          {commentSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                আপনার মন্তব্যটি সফলভাবে জমা হয়েছে! এডমিন মডারেশন পর্যালোচনার পর এটি ওয়েবসাইটে প্রদর্শিত হবে।
              </span>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  আপনার নাম (অথবা গেস্ট নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="আপনার নাম লিখুন..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  আপনার মতামত বা প্রশ্ন *
                </label>
                <textarea
                  rows={3}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="এই গ্যাজেট বা পোস্ট সম্পর্কে আপনার মতামত লিখুন..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  * স্প্যাম প্রতিরোধে এডমিন অ্যাপ্রুভালের পর মন্তব্য দৃশ্যমান হবে।
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>মন্তব্য জমা দিন</span>
                </button>
              </div>
            </form>
          )}

          {/* Approved Comments List */}
          <div className="space-y-3 pt-4">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনিই করুন!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{comment.guestName}</span>
                    <span className="text-[10px] text-slate-400">{formatBanglaDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{comment.text}</p>
                  {!comment.approved && (
                    <span className="inline-block text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium mt-1">
                      অপেক্ষমাণ (মডারেশন বাকি)
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  }

  // 2. BLOG LIST POSTS VIEW
  const blogAds = siteSettings.adSlots?.slots?.filter((s) => s.active && s.position === 'blogList') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Blog Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
          ভেনজা টেক জার্নাল
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          গ্যাজেট রিভিউ, টেক টিপস ও সিকিউরিটি আপডেট
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          বদলগাছী ও নওগাঁর গ্রাহকদের জন্য সঠিক পণ্য চয়ন ও টেকনোলজি গাইডলাইন
        </p>
      </div>

      {/* Blog Cards Grid with Interstitial Ad */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, idx) => {
          const showAd = idx === 1 && blogAds.length > 0 && siteSettings.adSlots?.blogListEnabled;
          return (
            <React.Fragment key={post.id}>
              <div
                onClick={() => setSelectedBlogPostId(post.id)}
                className="group cursor-pointer bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-slate-100 overflow-hidden relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {post.tags[0] || 'গ্যাজেট'}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatBanglaDate(post.createdAt)}</span>
                      <span>•</span>
                      <span>{post.readingTime || '৩ মিনিট'}</span>
                    </div>

                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 text-base leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {post.excerpt || post.content.substring(0, 100) + '...'}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 text-xs font-semibold text-emerald-700">
                  <span>সম্পূর্ণ পড়ুন</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {showAd && (
                <NativeAdCard ad={blogAds[0]} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
