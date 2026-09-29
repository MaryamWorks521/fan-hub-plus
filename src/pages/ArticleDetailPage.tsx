import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  Calendar,
  Sparkles,
  Check,
  Heart,
  Eye
} from 'lucide-react';
import { Article } from '../types/index.ts';
import { useBookmarks } from '../context/BookmarkContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface ArticleDetailPageProps {
  articleId: string;
  onBack: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  articleId,
  onBack,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/articles/${articleId}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data.article || null);
        if (data.article) {
          setLikes(data.article.likes || 120);
        }
      })
      .catch(err => console.error('Failed to load article:', err))
      .finally(() => setLoading(false));
  }, [articleId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center text-xs text-slate-500">
        Loading article narrative...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-slate-300">Article not found.</p>
        <button
          onClick={onBack}
          className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white"
        >
          Return to Articles
        </button>
      </div>
    );
  }

  const saved = isBookmarked(article.id);

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back button & Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>All Articles</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={() => {
              if (!user) {
                onOpenAuth('login');
              } else {
                toggleBookmark({
                  id: article.id,
                  title: article.title,
                  image: article.coverImage,
                  type: 'article',
                  fandom: article.fandom,
                  category: article.category
                });
              }
            }}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              saved
                ? 'bg-rose-600 text-white'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} />
            <span>{saved ? 'Saved' : 'Bookmark'}</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-2">
          <span className="uppercase tracking-wider">{article.category}</span>
          <span>·</span>
          <span>{article.fandom}</span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          {article.title}
        </h1>

        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-300">
          {article.summary}
        </p>

        {/* Author & Publication metadata */}
        <div className="mt-6 flex flex-wrap items-center justify-between border-t border-b border-slate-800 py-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src={article.authorAvatar}
              alt={article.author}
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-slate-200">{article.author}</p>
              <p className="text-[11px] text-slate-500">Contributing Editor</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{article.publishedAt}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span className="tabular-nums">{article.views} views</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
        <img
          src={article.coverImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="h-80 sm:h-96 w-full object-cover"
        />
      </div>

      {/* Timeline Highlights (Requirement 12: Timeline-style event highlights where appropriate) */}
      {article.timelineHighlights && article.timelineHighlights.length > 0 && (
        <div className="mb-10 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-rose-400 mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Key Franchise Timeline Milestones</span>
          </h3>
          <div className="space-y-4 border-l-2 border-rose-500/30 pl-4 ml-2">
            {article.timelineHighlights.map((tl, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-slate-950" />
                <span className="text-xs font-bold text-white">{tl.year}</span>
                <p className="text-xs text-slate-300 mt-0.5">{tl.event}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Rich Text Content */}
      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
        {article.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Tags */}
      <div className="mt-10 border-t border-slate-800 pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Tags:</span>
          {article.tags.map(tag => (
            <span key={tag} className="text-slate-300">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Appreciation Footer */}
      <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              hasLiked
                ? 'bg-rose-500 text-white'
                : 'border border-slate-800 bg-slate-950 text-slate-300 hover:text-white'
            }`}
          >
            <Heart className="h-3.5 w-3.5" fill={hasLiked ? 'currentColor' : 'none'} />
            <span className="tabular-nums">{likes} Applauds</span>
          </button>
          <span className="text-xs text-slate-400">Enjoyed this fandom deep-dive?</span>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-semibold text-rose-400 hover:underline"
        >
          More Articles →
        </button>
      </div>
    </article>
  );
};
