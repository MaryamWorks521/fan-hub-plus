
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  SEED_CATEGORIES,
  SEED_CHARACTERS,
  SEED_ARTICLES,
  SEED_MEDIA,
  SEED_EVENTS,
  SEED_MERCHANDISE,
  SEED_UPCOMING_RELEASES,
  SEED_FAQS
} from './seedData.ts';

import type {
  FandomCategory,
  FandomCharacter,
  FandomArticle,
  FandomMedia,
  FandomEvent,
  FandomMerchandise,
  UpcomingRelease
} from './seedData.ts';

export interface UserDocument {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
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
  resetToken?: string;
  resetTokenExpires?: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface BookmarkDocument {
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

export interface FeedbackDocument {
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

export interface FanSubmissionDocument {
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

export interface FaqDocument {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

export interface ActivityLogDocument {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  details: string;
  timestamp: string;
}

interface DatabaseSchema {
  users: UserDocument[];
  categories: FandomCategory[];
  characters: FandomCharacter[];
  articles: FandomArticle[];
  media: FandomMedia[];
  events: FandomEvent[];
  merchandise: FandomMerchandise[];
  upcoming_releases: UpcomingRelease[];
  bookmarks: BookmarkDocument[];
  feedback: FeedbackDocument[];
  submissions: FanSubmissionDocument[];
  faqs: FaqDocument[];
  activity_logs: ActivityLogDocument[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'fanhub_db.json');

// Helper to hash passwords using PBKDF2
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const activeSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, activeSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: activeSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(calculated, 'hex'));
}

class FanHubDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.initializeDatabase();
  }

  private initializeDatabase(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.categories) {
          // Sync all expanded seed collections seamlessly
          parsed.categories = SEED_CATEGORIES;
          parsed.characters = SEED_CHARACTERS;
          parsed.articles = SEED_ARTICLES;
          parsed.media = SEED_MEDIA;
          parsed.events = SEED_EVENTS;
          parsed.merchandise = SEED_MERCHANDISE;
          parsed.upcoming_releases = SEED_UPCOMING_RELEASES;
          return parsed;
        }
      } catch (err) {
        console.warn('Error reading existing DB file, re-seeding:', err);
      }
    }

    // Default Seed Admin & User Passwords
    const adminPass = hashPassword('Admin123!');
    const fanPass = hashPassword('Fan123!');

    const initialUsers: UserDocument[] = [
      {
        id: 'usr-admin',
        name: 'Administrator',
        email: 'admin@fanhubplus.com',
        passwordHash: adminPass.hash,
        salt: adminPass.salt,
        role: 'admin',
        avatar: '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
        favoriteFandoms: ['Jujutsu Kaisen', 'Elden Ring', 'Spider-Man'],
        favoriteCategories: ['anime', 'gaming', 'movies'],
        displayPreferences: {
          theme: 'dark',
          fontSize: 'normal',
          emailNotifications: true
        },
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
        lastLoginAt: new Date().toISOString()
      },
      {
        id: 'usr-alex',
        name: 'Alex Rivera',
        email: 'alex@fanhubplus.com',
        passwordHash: fanPass.hash,
        salt: fanPass.salt,
        role: 'user',
        avatar: '/src/assets/images/fandom_anime_cyber_1790294513680.jpg',
        favoriteFandoms: ['Elden Ring', 'Chainsaw Man', 'Spider-Man', 'NewJeans'],
        favoriteCategories: ['gaming', 'anime', 'k-pop'],
        displayPreferences: {
          theme: 'dark',
          fontSize: 'normal',
          emailNotifications: true
        },
        isActive: true,
        createdAt: '2026-01-15T10:00:00Z',
        lastLoginAt: new Date().toISOString()
      }
    ];

    const initialBookmarks: BookmarkDocument[] = [
      {
        id: 'bm-1',
        userId: 'usr-alex',
        contentId: 'char-1',
        contentType: 'character',
        contentTitle: 'Satoru Gojo',
        contentImage: '/src/assets/images/fandom_anime_cyber_1790294513680.jpg',
        fandom: 'Jujutsu Kaisen',
        category: 'anime',
        notes: 'Review his Six Eyes mechanics before the new season drops!',
        createdAt: '2026-02-10T12:00:00Z'
      },
      {
        id: 'bm-2',
        userId: 'usr-alex',
        contentId: 'art-2',
        contentType: 'article',
        contentTitle: 'World Building in Soulslike Games: Environmental Storytelling Masterclass',
        contentImage: '/src/assets/images/fandom_gaming_rpg_1790294531423.jpg',
        fandom: 'Elden Ring',
        category: 'gaming',
        notes: 'Incredible breakdown on ruins as narrative fragments.',
        createdAt: '2026-03-01T15:30:00Z'
      },
      {
        id: 'bm-3',
        userId: 'usr-alex',
        contentId: 'merch-2',
        contentType: 'merchandise',
        contentTitle: 'Malenia Haligtree Helm Replica - 1:1 Scale Wearable Brass',
        contentImage: '/src/assets/images/fandom_gaming_rpg_1790294531423.jpg',
        fandom: 'Elden Ring',
        category: 'gaming',
        notes: 'Pre-order alert for September 2026.',
        createdAt: '2026-03-05T09:15:00Z'
      }
    ];

    const initialFeedback: FeedbackDocument[] = [
      {
        id: 'fb-1',
        userId: 'usr-alex',
        userName: 'Alex Rivera',
        userEmail: 'alex@fanhubplus.com',
        type: 'suggestion',
        message: 'Could you add a filter for 4K video resolution in the Multimedia Center?',
        status: 'in-review',
        adminReply: 'Great suggestion, Alex! We are working on HD/4K bitrate tagging.',
        createdAt: '2026-03-10T08:00:00Z',
        updatedAt: '2026-03-11T10:00:00Z'
      }
    ];

    const initialSubmissions: FanSubmissionDocument[] = [
      {
        id: 'sub-1',
        userId: 'usr-alex',
        authorName: 'Alex Rivera',
        authorEmail: 'alex@fanhubplus.com',
        title: 'Decoding the Runes: Mythological Symbolism in Elden Ring',
        category: 'gaming',
        fandom: 'Elden Ring',
        type: 'theory',
        summary: 'A 2,000-word deep dive into Norse tree cosmology and how the Erdtree subverts Yggdrasil motifs.',
        content: 'Throughout FromSoftware history, sacred flora often symbolizes divine cycles of rebirth. In Elden Ring, the golden luminescence of the Erdtree conceals an extraterrestrial parasite that rewrote the natural law of death...',
        image: '/src/assets/images/fandom_gaming_rpg_1790294531423.jpg',
        status: 'approved',
        adminFeedback: 'Exceptional analytical depth. Approved for public curation!',
        createdAt: '2026-03-14T11:20:00Z',
        reviewedAt: '2026-03-15T09:00:00Z'
      }
    ];

    const initialActivity: ActivityLogDocument[] = [
      {
        id: 'act-1',
        userId: 'usr-alex',
        userName: 'Alex Rivera',
        action: 'BOOKMARK_ADDED',
        details: 'Saved Malenia Haligtree Helm Replica to bookmarks',
        timestamp: '2026-03-05T09:15:00Z'
      },
      {
        id: 'act-2',
        userId: 'usr-alex',
        userName: 'Alex Rivera',
        action: 'SUBMISSION_CREATED',
        details: 'Drafted fan analysis "Decoding the Runes"',
        timestamp: '2026-03-14T11:20:00Z'
      }
    ];

    const schema: DatabaseSchema = {
      users: initialUsers,
      categories: SEED_CATEGORIES,
      characters: SEED_CHARACTERS,
      articles: SEED_ARTICLES,
      media: SEED_MEDIA,
      events: SEED_EVENTS,
      merchandise: SEED_MERCHANDISE,
      upcoming_releases: SEED_UPCOMING_RELEASES,
      bookmarks: initialBookmarks,
      feedback: initialFeedback,
      submissions: initialSubmissions,
      faqs: SEED_FAQS,
      activity_logs: initialActivity
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(schema, null, 2), 'utf-8');
    return schema;
  }

  public save(): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Getters for collections
  public get users() { return this.data.users; }
  public get categories() { return this.data.categories; }
  public get characters() { return this.data.characters; }
  public get articles() { return this.data.articles; }
  public get media() { return this.data.media; }
  public get events() { return this.data.events; }
  public get merchandise() { return this.data.merchandise; }
  public get upcoming_releases() { return this.data.upcoming_releases; }
  public get bookmarks() { return this.data.bookmarks; }
  public get feedback() { return this.data.feedback; }
  public get submissions() { return this.data.submissions; }
  public get faqs() { return this.data.faqs; }
  public get activity_logs() { return this.data.activity_logs; }

  // Query helper methods
  public logActivity(userId: string | undefined, userName: string | undefined, action: string, details: string) {
    this.data.activity_logs.unshift({
      id: 'act-' + Date.now(),
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    if (this.data.activity_logs.length > 200) {
      this.data.activity_logs.pop();
    }
    this.save();
  }
}

export const db = new FanHubDatabase();