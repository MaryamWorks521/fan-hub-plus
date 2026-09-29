import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bookmark } from '../types/index.ts';
import { useAuth } from '../context/useAuth';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  isBookmarked: (contentId: string) => boolean;
  getBookmark: (contentId: string) => Bookmark | undefined;
  toggleBookmark: (item: {
    id: string;
    title: string;
    image: string;
    type: string;
    fandom?: string;
    category?: string;
    notes?: string;
  }) => Promise<boolean>;
  updateNotes: (bookmarkId: string, notes: string) => Promise<void>;
  removeBookmark: (bookmarkId: string) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshBookmarks = async () => {
    if (!token || !user) {
      setBookmarks([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks || []);
      }
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBookmarks();
  }, [token, user]);

  const isBookmarked = (contentId: string): boolean => {
    return bookmarks.some(b => b.contentId === contentId || b.id === contentId);
  };

  const getBookmark = (contentId: string): Bookmark | undefined => {
    return bookmarks.find(b => b.contentId === contentId || b.id === contentId);
  };

  const toggleBookmark = async (item: {
    id: string;
    title: string;
    image: string;
    type: string;
    fandom?: string;
    category?: string;
    notes?: string;
  }): Promise<boolean> => {
    if (!token) return false;

    const existing = bookmarks.find(b => b.contentId === item.id);
    if (existing) {
      // Remove
      await removeBookmark(existing.id);
      return false;
    } else {
      // Add
      try {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            contentId: item.id,
            contentType: item.type,
            contentTitle: item.title,
            contentImage: item.image,
            fandom: item.fandom,
            category: item.category,
            notes: item.notes || ''
          })
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarks(prev => [data.bookmark, ...prev]);
          return true;
        }
      } catch (err) {
        console.error('Failed to add bookmark:', err);
      }
      return false;
    }
  };

  const updateNotes = async (bookmarkId: string, notes: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/bookmarks/${bookmarkId}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });
      if (res.ok) {
        setBookmarks(prev =>
          prev.map(b => (b.id === bookmarkId ? { ...b, notes } : b))
        );
      }
    } catch (err) {
      console.error('Failed to update notes:', err);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId && b.contentId !== bookmarkId));
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        loading,
        isBookmarked,
        getBookmark,
        toggleBookmark,
        updateNotes,
        removeBookmark,
        refreshBookmarks
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
