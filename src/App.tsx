import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { BookmarkProvider } from './context/BookmarkContext.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { ContentDetailModal } from './components/ContentDetailModal.tsx';
import { Chatbot } from './components/Chatbot.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ExplorePage } from './pages/ExplorePage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { CategoryDetailPage } from './pages/CategoryDetailPage.tsx';
import { CharactersPage } from './pages/CharactersPage.tsx';
import { ArticlesPage } from './pages/ArticlesPage.tsx';
import { ArticleDetailPage } from './pages/ArticleDetailPage.tsx';
import { MultimediaPage } from './pages/MultimediaPage.tsx';
import { EventsPage } from './pages/EventsPage.tsx';
import { MerchandisePage } from './pages/MerchandisePage.tsx';
import { UpcomingPage } from './pages/UpcomingPage.tsx';
import { SubmissionsPage } from './pages/SubmissionsPage.tsx';
import { FeedbackPage } from './pages/FeedbackPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { SitemapPage } from './pages/SitemapPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';

import { ContentItem, MediaItem } from './types/index.ts';
import { MovieBoxModal } from './components/MovieBoxModal.tsx';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedContentItem, setSelectedContentItem] = useState<ContentItem | null>(null);
  const [activeCinemaMedia, setActiveCinemaMedia] = useState<MediaItem | null>(null);

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSelectItemFromSearch = (item: ContentItem) => {
    if (item.type === 'article') {
      handleNavigate('article-detail', item.id);
    } else if (item.type === 'character') {
      handleNavigate('characters', item.id);
    } else {
      setSelectedContentItem(item);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 transition-colors">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectContent={setSelectedContentItem}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'explore' && (
          <ExplorePage
            onSelectItem={setSelectedContentItem}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'categories' && (
          <CategoriesPage
            onSelectCategory={slug => handleNavigate('category-detail', slug)}
          />
        )}

        {currentView === 'category-detail' && (
          <CategoryDetailPage
            categorySlug={viewParam || 'anime'}
            onBack={() => handleNavigate('categories')}
            onSelectContent={setSelectedContentItem}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'characters' && (
          <CharactersPage
            initialCharacterId={viewParam}
            onSelectArticle={id => handleNavigate('article-detail', id)}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'articles' && (
          <ArticlesPage
            onSelectArticle={id => handleNavigate('article-detail', id)}
            onNavigateSubmissions={() => handleNavigate('submissions')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'article-detail' && (
          <ArticleDetailPage
            articleId={viewParam || 'art-1'}
            onBack={() => handleNavigate('articles')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'multimedia' && (
          <MultimediaPage onOpenAuth={handleOpenAuth} />
        )}

        {currentView === 'events' && (
          <EventsPage onOpenAuth={handleOpenAuth} />
        )}

        {currentView === 'merchandise' && (
          <MerchandisePage onOpenAuth={handleOpenAuth} />
        )}

        {currentView === 'upcoming' && <UpcomingPage />}

        {currentView === 'submissions' && (
          <SubmissionsPage onOpenAuth={handleOpenAuth} />
        )}

        {currentView === 'feedback' && <FeedbackPage />}

        {currentView === 'dashboard' && (
          <DashboardPage
            onNavigate={handleNavigate}
            onSelectContent={setSelectedContentItem}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === 'profile' && <ProfilePage />}

        {currentView === 'admin' && <AdminPage />}

        {currentView === 'login' && <LoginPage onNavigate={handleNavigate} />}

        {currentView === 'sitemap' && (
          <SitemapPage
            onNavigate={handleNavigate}
            onOpenAuth={handleOpenAuth}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectItem={handleSelectItemFromSearch}
      />

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />

      <ContentDetailModal
        item={selectedContentItem}
        onClose={() => setSelectedContentItem(null)}
        onOpenAuth={handleOpenAuth}
        onWatchCinema={setActiveCinemaMedia}
      />

      {/* Global MovieBox Cinema Video Player Modal */}
      <MovieBoxModal
        media={activeCinemaMedia}
        onClose={() => setActiveCinemaMedia(null)}
      />

      {/* Experience Settings & Multilingual Modal */}
      <SettingsModal />

      {/* Optional AI Assistant Floating Button */}
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider>
          <BookmarkProvider>
            <MainApp />
          </BookmarkProvider>
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
