export interface User {
  id: string;
  name: string;
  email: string;
  role: 'visitor' | 'user' | 'admin';
  avatar: string;
  favoriteFandoms: string[];
  favoriteCategories: string[];
  displayPreferences: {
    theme: 'dark' | 'light';
    fontSize: 'normal' | 'large' | 'compact';
    emailNotifications: boolean;
  };
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface FandomCategory {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  accentColor: string;
  genres: string[];
  itemCount: number;
}

export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  fandom: string;
  type: 'article' | 'video' | 'audio' | 'trailer' | 'character' | 'event' | 'merchandise' | 'image';
  description: string;
  fullText?: string;
  image: string;
  mediaUrl?: string;
  rating: number;
  popularity: number;
  releaseYear: number;
  genre: string;
  tags: string[];
  author?: string;
  publishedAt?: string;
  price?: string;
  status?: string;
  venue?: string;
  city?: string;
  date?: string;
  duration?: string;
}

export interface Character {
  id: string;
  name: string;
  fandom: string;
  category: string;
  role: string;
  avatar: string;
  coverImage: string;
  shortBio: string;
  fullBio: string;
  abilities: string[];
  voiceActor?: string;
  firstAppearance: string;
  relatedCharacterIds?: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  fandom: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  summary: string;
  content: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
  isApproved: boolean;
  timelineHighlights?: { year: string; event: string }[];
}

export interface MediaServer {
  id: string;
  name: string;
  url: string;
  type: 'html5' | 'embed' | 'audio';
  quality: string;
}

export interface MediaEpisode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
}

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  fandom: string;
  type: 'video' | 'trailer' | 'audio' | 'podcast' | 'soundtrack' | 'movie' | 'anime';
  url: string;
  videoSource?: string;
  thumbnail: string;
  duration: string;
  description: string;
  rating: number;
  views: number;
  tags: string[];
  quality?: string;
  year?: number;
  director?: string;
  genre?: string;
  servers?: MediaServer[];
  episodes?: MediaEpisode[];
}

export interface FandomEvent {
  id: string;
  title: string;
  category: string;
  fandom: string;
  type: 'convention' | 'meetup' | 'premiere' | 'concert' | 'screening';
  date: string;
  time: string;
  city: string;
  venue: string;
  coordinates: { lat: number; lng: number };
  description: string;
  image: string;
  ticketUrl: string;
  price: string;
  attendeesCount: number;
}

export interface MerchandiseItem {
  id: string;
  title: string;
  fandom: string;
  category: string;
  description: string;
  image: string;
  tags: ('Limited Edition' | 'Pre-Order' | 'Collectible')[];
  status: 'available' | 'upcoming' | 'preorder';
  popularity: number;
  releaseDate: string;
  estimatedPrice: string;
}

export interface UpcomingRelease {
  id: string;
  title: string;
  fandom: string;
  category: string;
  type: 'Anime' | 'Gaming' | 'Movies' | 'TV Shows' | 'Comics' | 'Manga' | 'Merchandise';
  releaseDate: string;
  image: string;
  synopsis: string;
  hypeScore: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  contentId: string;
  contentType: 'article' | 'character' | 'media' | 'event' | 'merchandise' | 'content';
  contentTitle: string;
  contentImage: string;
  fandom?: string;
  category?: string;
  notes: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  type: 'bug' | 'suggestion' | 'query';
  message: string;
  status: 'pending' | 'in-review' | 'resolved';
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FanSubmission {
  id: string;
  userId: string;
  authorName: string;
  authorEmail: string;
  title: string;
  category: string;
  fandom: string;
  type: 'article' | 'cosplay' | 'art' | 'theory';
  summary: string;
  content: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
}
