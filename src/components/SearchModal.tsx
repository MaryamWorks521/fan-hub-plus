import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Film, Calendar, ShoppingBag, User, ArrowRight } from 'lucide-react';
import { ContentItem } from '../types/index.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: ContentItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectItem }) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let url = `/api/content?search=${encodeURIComponent(query)}`;
        if (typeFilter !== 'all') {
          url += `&contentType=${typeFilter}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setResults(data.items || []);
        }
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, typeFilter, isOpen]);

  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character':
        return <User className="h-4 w-4 text-emerald-400" />;
      case 'article':
        return <BookOpen className="h-4 w-4 text-indigo-400" />;
      case 'video':
      case 'trailer':
      case 'audio':
      case 'soundtrack':
        return <Film className="h-4 w-4 text-rose-400" />;
      case 'event':
        return <Calendar className="h-4 w-4 text-amber-400" />;
      case 'merchandise':
        return <ShoppingBag className="h-4 w-4 text-pink-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-16 backdrop-blur-sm sm:pt-24">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Search Header */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search characters, anime, games, articles, events, merch..."
            className="flex-1 bg-transparent px-3 text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-950/40 px-4 py-2 text-xs">
          {[
            { label: 'All Results', val: 'all' },
            { label: 'Characters', val: 'character' },
            { label: 'Articles', val: 'article' },
            { label: 'Media', val: 'video' },
            { label: 'Events', val: 'event' },
            { label: 'Merchandise', val: 'merchandise' }
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setTypeFilter(f.val)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                typeFilter === f.val
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              Searching the fandom universe...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map(item => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-800/80"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <h4 className="truncate text-xs font-semibold text-slate-100">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-slate-400">· {item.category}</span>
                    </div>
                    <p className="truncate text-[11px] text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300" />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              {query ? 'No matching fandom entries found.' : 'Type to search the Fandom Universe.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
