/**
 * REST API routes for Fan Hub Plus
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import {
  db,
  hashPassword,
  verifyPassword,
  UserDocument,
  BookmarkDocument,
  FeedbackDocument,
  FanSubmissionDocument,
  FaqDocument
} from './db.ts';
import {
  AuthenticatedRequest,
  createSessionToken,
  removeSessionToken,
  requireAuth,
  requireAdmin
} from './auth.ts';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & USER MANAGEMENT
// ==========================================

apiRouter.get('/auth/database-info', (_req: Request, res: Response) => {
  res.json({
    status: 'connected',
    databaseFile: 'data/fanhub_db.json',
    totalUsers: db.users.length,
    users: db.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt
    }))
  });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, confirmPassword, favoriteFandoms, favoriteCategories } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    return;
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ error: 'An account with this email address already exists.' });
    return;
  }

  const { hash, salt } = hashPassword(password);
  const newUser: UserDocument = {
    id: 'usr-' + Date.now(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: hash,
    salt,
    role: 'user',
    avatar: '/src/assets/images/fandom_anime_cyber_1790294513680.jpg',
    favoriteFandoms: Array.isArray(favoriteFandoms) ? favoriteFandoms : ['Anime', 'Gaming'],
    favoriteCategories: Array.isArray(favoriteCategories) ? favoriteCategories : ['anime', 'gaming'],
    displayPreferences: {
      theme: 'dark',
      fontSize: 'normal',
      emailNotifications: true
    },
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  db.users.push(newUser);
  db.logActivity(newUser.id, newUser.name, 'USER_REGISTERED', `New account registered: ${newUser.email}`);
  db.save();

  const token = createSessionToken(newUser.id);
  const { passwordHash, salt: _, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ error: 'This account has been deactivated by an administrator.' });
    return;
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  user.lastLoginAt = new Date().toISOString();
  db.logActivity(user.id, user.name, 'USER_LOGIN', `User logged in from web client`);
  db.save();

  const token = createSessionToken(user.id);
  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { passwordHash: _, salt: __, ...safeUser } = req.user!;
  res.json({ user: safeUser });
});

apiRouter.post('/auth/logout', (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    removeSessionToken(authHeader.substring(7).trim());
  }
  res.json({ message: 'Successfully logged out.' });
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    // Return success to avoid email enumeration
    res.json({ message: 'If an account exists with this email, a reset token has been issued.' });
    return;
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour
  db.save();

  res.json({
    message: 'Reset token generated successfully.',
    resetToken // Returned directly for local demo / academic project verification
  });
});

apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    res.status(400).json({ error: 'Reset token and new password are required.' });
    return;
  }

  const user = db.users.find(u => u.resetToken === resetToken && (u.resetTokenExpires || 0) > Date.now());
  if (!user) {
    res.status(400).json({ error: 'Invalid or expired password reset token.' });
    return;
  }

  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.salt = salt;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  db.save();

  res.json({ message: 'Password has been reset successfully. You can now log in.' });
});

apiRouter.put('/users/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { name, avatar, favoriteFandoms, favoriteCategories, displayPreferences } = req.body;

  if (name) user.name = name.trim();
  if (avatar) user.avatar = avatar;
  if (Array.isArray(favoriteFandoms)) user.favoriteFandoms = favoriteFandoms;
  if (Array.isArray(favoriteCategories)) user.favoriteCategories = favoriteCategories;
  if (displayPreferences) {
    user.displayPreferences = {
      ...user.displayPreferences,
      ...displayPreferences
    };
  }

  db.logActivity(user.id, user.name, 'PROFILE_UPDATED', `Profile preferences updated`);
  db.save();

  const { passwordHash: _, salt: __, ...safeUser } = user;
  res.json({ user: safeUser, message: 'Profile updated successfully.' });
});

apiRouter.get('/users', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const safeUsers = db.users.map(({ passwordHash: _, salt: __, ...safe }) => safe);
  res.json({ users: safeUsers });
});

apiRouter.patch('/users/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const target = db.users.find(u => u.id === req.params.id);
  if (!target) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  if (target.role === 'admin' && target.id === req.user!.id) {
    res.status(400).json({ error: 'Cannot deactivate your own administrator account.' });
    return;
  }
  target.isActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : !target.isActive;
  db.logActivity(req.user!.id, req.user!.name, 'USER_STATUS_TOGGLED', `User ${target.email} active status set to ${target.isActive}`);
  db.save();
  res.json({ message: `User status updated to ${target.isActive ? 'active' : 'deactivated'}.` });
});

apiRouter.patch('/users/:id/role', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { role } = req.body;
  if (!['visitor', 'user', 'admin'].includes(role)) {
    res.status(400).json({ error: 'Invalid role.' });
    return;
  }
  const target = db.users.find(u => u.id === req.params.id);
  if (!target) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }
  target.role = role;
  db.logActivity(req.user!.id, req.user!.name, 'USER_ROLE_CHANGED', `User ${target.email} role changed to ${role}`);
  db.save();
  res.json({ message: `User role changed to ${role}.` });
});

// ==========================================
// 2. CATEGORIES
// ==========================================

apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({ categories: db.categories });
});

apiRouter.get('/categories/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug.toLowerCase();
  const category = db.categories.find(c => c.slug === slug || c.id === slug);
  if (!category) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }

  const categoryName = category.slug;
  const articles = db.articles.filter(a => a.category === categoryName);
  const characters = db.characters.filter(c => c.category === categoryName);
  const media = db.media.filter(m => m.category === categoryName);
  const events = db.events.filter(e => e.category === categoryName);
  const merchandise = db.merchandise.filter(m => m.category === categoryName);
  const releases = db.upcoming_releases.filter(r => r.category === categoryName);

  res.json({
    category,
    articles,
    characters,
    media,
    events,
    merchandise,
    releases
  });
});

apiRouter.post('/categories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, tagline, description, coverImage, accentColor, genres } = req.body;
  if (!name || !description) {
    res.status(400).json({ error: 'Name and description are required.' });
    return;
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat = {
    id: 'cat-' + Date.now(),
    slug,
    name,
    tagline: tagline || `Discover ${name} fandom universe`,
    description,
    coverImage: coverImage || '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    accentColor: accentColor || 'from-rose-500 to-indigo-500',
    genres: Array.isArray(genres) ? genres : ['General'],
    itemCount: 0
  };
  db.categories.push(newCat);
  db.save();
  res.status(201).json({ category: newCat, message: 'Category created successfully.' });
});

apiRouter.put('/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const cat = db.categories.find(c => c.id === req.params.id);
  if (!cat) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  Object.assign(cat, req.body);
  db.save();
  res.json({ category: cat, message: 'Category updated successfully.' });
});

apiRouter.delete('/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  db.categories.splice(idx, 1);
  db.save();
  res.json({ message: 'Category deleted successfully.' });
});

// ==========================================
// 3. UNIFIED CONTENT EXPLORER & GLOBAL SEARCH
// ==========================================

apiRouter.get('/content', (req: Request, res: Response) => {
  const { search, category, genre, releaseYear, contentType, sort } = req.query;

  // Aggregate items across articles, characters, media, events, merchandise
  let allItems: any[] = [];

  db.articles.forEach(a => {
    allItems.push({
      id: a.id,
      title: a.title,
      slug: a.slug,
      category: a.category,
      fandom: a.fandom,
      type: 'article',
      description: a.summary,
      fullText: a.content,
      image: a.coverImage,
      rating: 4.8,
      popularity: a.views || 1000,
      releaseYear: parseInt(a.publishedAt.slice(0, 4)) || 2026,
      genre: a.tags[0] || 'Lore',
      tags: a.tags,
      author: a.author,
      publishedAt: a.publishedAt
    });
  });

  db.characters.forEach(c => {
    allItems.push({
      id: c.id,
      title: c.name,
      slug: c.id,
      category: c.category,
      fandom: c.fandom,
      type: 'character',
      description: c.shortBio,
      fullText: c.fullBio,
      image: c.avatar,
      rating: 4.9,
      popularity: 9500,
      releaseYear: 2022,
      genre: c.role,
      tags: c.abilities,
      author: 'Canon'
    });
  });

  db.media.forEach(m => {
    allItems.push({
      id: m.id,
      title: m.title,
      slug: m.id,
      category: m.category,
      fandom: m.fandom,
      type: m.type,
      description: m.description,
      image: m.thumbnail,
      mediaUrl: m.url,
      rating: m.rating,
      popularity: m.views || 5000,
      releaseYear: 2026,
      genre: m.tags[0] || 'Media',
      tags: m.tags,
      duration: m.duration
    });
  });

  db.events.forEach(e => {
    allItems.push({
      id: e.id,
      title: e.title,
      slug: e.id,
      category: e.category,
      fandom: e.fandom,
      type: 'event',
      description: e.description,
      image: e.image,
      rating: 4.7,
      popularity: e.attendeesCount || 20000,
      releaseYear: parseInt(e.date.slice(0, 4)) || 2026,
      genre: e.type,
      tags: [e.city, e.venue, e.price],
      date: e.date,
      venue: e.venue,
      city: e.city
    });
  });

  db.merchandise.forEach(m => {
    allItems.push({
      id: m.id,
      title: m.title,
      slug: m.id,
      category: m.category,
      fandom: m.fandom,
      type: 'merchandise',
      description: m.description,
      image: m.image,
      rating: 4.9,
      popularity: m.popularity * 100,
      releaseYear: parseInt(m.releaseDate.slice(0, 4)) || 2026,
      genre: m.tags[0] || 'Collectible',
      tags: m.tags,
      price: m.estimatedPrice,
      status: m.status
    });
  });

  // Apply Search
  if (typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    allItems = allItems.filter(item =>
      item.title.toLowerCase().includes(q) ||
      (item.fandom && item.fandom.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some((t: string) => t.toLowerCase().includes(q))) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  }

  // Apply Category filter
  if (typeof category === 'string' && category && category !== 'all') {
    allItems = allItems.filter(item => item.category === category.toLowerCase());
  }

  // Apply Content Type filter
  if (typeof contentType === 'string' && contentType && contentType !== 'all') {
    allItems = allItems.filter(item => item.type === contentType.toLowerCase());
  }

  // Apply Release Year filter
  if (releaseYear && releaseYear !== 'all') {
    const y = parseInt(releaseYear as string);
    if (!isNaN(y)) {
      allItems = allItems.filter(item => item.releaseYear === y);
    }
  }

  // Apply Sorting
  if (sort === 'alpha') {
    allItems.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'popular') {
    allItems.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  } else {
    // Default 'latest'
    allItems.sort((a, b) => (b.releaseYear || 2026) - (a.releaseYear || 2026));
  }

  res.json({
    total: allItems.length,
    items: allItems
  });
});

apiRouter.get('/content/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  // Search across all models
  const article = db.articles.find(a => a.id === id || a.slug === id);
  if (article) return res.json({ item: { ...article, type: 'article' } });

  const character = db.characters.find(c => c.id === id);
  if (character) return res.json({ item: { ...character, type: 'character' } });

  const media = db.media.find(m => m.id === id);
  if (media) return res.json({ item: { ...media, type: media.type } });

  const event = db.events.find(e => e.id === id);
  if (event) return res.json({ item: { ...event, type: 'event' } });

  const merch = db.merchandise.find(m => m.id === id);
  if (merch) return res.json({ item: { ...merch, type: 'merchandise' } });

  res.status(404).json({ error: 'Content item not found.' });
});

// ==========================================
// 4. CHARACTERS
// ==========================================

apiRouter.get('/characters', (req: Request, res: Response) => {
  const { category, fandom, search } = req.query;
  let list = [...db.characters];

  if (category && category !== 'all') {
    list = list.filter(c => c.category === category);
  }
  if (fandom) {
    list = list.filter(c => c.fandom.toLowerCase().includes((fandom as string).toLowerCase()));
  }
  if (search) {
    const q = (search as string).toLowerCase();
    list = list.filter(c => c.name.toLowerCase().includes(q) || c.fandom.toLowerCase().includes(q));
  }

  res.json({ characters: list });
});

apiRouter.get('/characters/:id', (req: Request, res: Response) => {
  const char = db.characters.find(c => c.id === req.params.id);
  if (!char) {
    res.status(404).json({ error: 'Character profile not found.' });
    return;
  }

  const relatedCharacters = db.characters.filter(c =>
    char.relatedCharacterIds?.includes(c.id) || (c.category === char.category && c.id !== char.id)
  );

  const relatedArticles = db.articles.filter(a =>
    a.category === char.category || a.fandom.toLowerCase().includes(char.fandom.toLowerCase())
  );

  res.json({
    character: char,
    relatedCharacters: relatedCharacters.slice(0, 3),
    relatedArticles: relatedArticles.slice(0, 3)
  });
});

apiRouter.post('/characters', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, fandom, category, role, avatar, coverImage, shortBio, fullBio, abilities, voiceActor, firstAppearance } = req.body;
  if (!name || !fandom || !category) {
    res.status(400).json({ error: 'Name, fandom, and category are required.' });
    return;
  }
  const newChar = {
    id: 'char-' + Date.now(),
    name,
    fandom,
    category,
    role: role || 'Iconic Protagonist',
    avatar: avatar || '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    coverImage: coverImage || avatar || '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    shortBio: shortBio || '',
    fullBio: fullBio || shortBio || '',
    abilities: Array.isArray(abilities) ? abilities : [],
    voiceActor: voiceActor || '',
    firstAppearance: firstAppearance || 'Debut 2026'
  };
  db.characters.push(newChar);
  db.save();
  res.status(201).json({ character: newChar, message: 'Character profile created successfully.' });
});

apiRouter.put('/characters/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const char = db.characters.find(c => c.id === req.params.id);
  if (!char) {
    res.status(404).json({ error: 'Character not found.' });
    return;
  }
  Object.assign(char, req.body);
  db.save();
  res.json({ character: char, message: 'Character updated.' });
});

apiRouter.delete('/characters/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const idx = db.characters.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    res.status(404).json({ error: 'Character not found.' });
    return;
  }
  db.characters.splice(idx, 1);
  db.save();
  res.json({ message: 'Character deleted.' });
});

// ==========================================
// 5. ARTICLES
// ==========================================

apiRouter.get('/articles', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let articles = db.articles.filter(a => a.isApproved);

  if (category && category !== 'all') {
    articles = articles.filter(a => a.category === category);
  }
  if (search) {
    const q = (search as string).toLowerCase();
    articles = articles.filter(a => a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q));
  }

  res.json({ articles });
});

apiRouter.get('/articles/:id', (req: Request, res: Response) => {
  const article = db.articles.find(a => a.id === req.params.id || a.slug === req.params.id);
  if (!article) {
    res.status(404).json({ error: 'Article not found.' });
    return;
  }
  article.views = (article.views || 0) + 1;
  db.save();
  res.json({ article });
});

apiRouter.post('/articles', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, fandom, summary, content, coverImage, tags } = req.body;
  if (!title || !summary || !content) {
    res.status(400).json({ error: 'Title, summary, and content are required.' });
    return;
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newArticle = {
    id: 'art-' + Date.now(),
    title,
    slug,
    category: category || 'anime',
    fandom: fandom || 'General',
    author: req.user!.name,
    authorAvatar: req.user!.avatar,
    coverImage: coverImage || '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    summary,
    content,
    tags: Array.isArray(tags) ? tags : ['Editorial'],
    readTime: `${Math.max(2, Math.round(content.split(' ').length / 200))} min read`,
    publishedAt: new Date().toISOString().slice(0, 10),
    views: 1,
    likes: 0,
    isApproved: true
  };

  db.articles.unshift(newArticle);
  db.save();
  res.status(201).json({ article: newArticle, message: 'Article published.' });
});

// ==========================================
// 6. MULTIMEDIA CENTER
// ==========================================

apiRouter.get('/media', (req: Request, res: Response) => {
  const { type, category } = req.query;
  let items = [...db.media];

  if (type && type !== 'all') {
    items = items.filter(m => m.type === type);
  }
  if (category && category !== 'all') {
    items = items.filter(m => m.category === category);
  }

  res.json({ media: items });
});

apiRouter.post('/media/:id/rate', (req: Request, res: Response) => {
  const { rating } = req.body;
  const num = parseFloat(rating);
  if (isNaN(num) || num < 1 || num > 5) {
    res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    return;
  }

  const media = db.media.find(m => m.id === req.params.id);
  if (!media) {
    res.status(404).json({ error: 'Media item not found.' });
    return;
  }

  // Update weighted average
  media.rating = Number(((media.rating * 4 + num) / 5).toFixed(1));
  db.save();
  res.json({ message: 'Rating recorded.', updatedRating: media.rating });
});

// ==========================================
// 7. EVENTS & CALENDAR
// ==========================================

apiRouter.get('/events', (req: Request, res: Response) => {
  const { city, category, month } = req.query;
  let list = [...db.events];

  if (city && city !== 'all') {
    list = list.filter(e => e.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (category && category !== 'all') {
    list = list.filter(e => e.category === category);
  }
  if (month && month !== 'all') {
    list = list.filter(e => e.date.startsWith(month as string));
  }

  res.json({ events: list });
});

apiRouter.post('/events', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, fandom, type, date, time, city, venue, description, price, ticketUrl } = req.body;
  if (!title || !date || !city || !venue) {
    res.status(400).json({ error: 'Title, date, city, and venue are required.' });
    return;
  }
  const newEvent = {
    id: 'ev-' + Date.now(),
    title,
    category: category || 'anime',
    fandom: fandom || 'Pop Culture',
    type: type || 'convention',
    date,
    time: time || '10:00 AM - 06:00 PM',
    city,
    venue,
    coordinates: { lat: 34.05, lng: -118.25 },
    description: description || '',
    image: '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    ticketUrl: ticketUrl || 'https://example.com/tickets',
    price: price || '$50',
    attendeesCount: 5000
  };
  db.events.push(newEvent);
  db.save();
  res.status(201).json({ event: newEvent, message: 'Event added successfully.' });
});

// ==========================================
// 8. MERCHANDISE SHOWCASE (Strictly Discovery per SRS)
// ==========================================

apiRouter.get('/merchandise', (req: Request, res: Response) => {
  const { category, tag, status } = req.query;
  let items = [...db.merchandise];

  if (category && category !== 'all') {
    items = items.filter(m => m.category === category);
  }
  if (tag && tag !== 'all') {
    items = items.filter(m => m.tags.includes(tag as any));
  }
  if (status && status !== 'all') {
    items = items.filter(m => m.status === status);
  }

  res.json({ merchandise: items });
});

apiRouter.post('/merchandise', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { title, fandom, category, description, tags, status, estimatedPrice } = req.body;
  if (!title || !fandom || !category) {
    res.status(400).json({ error: 'Title, fandom, and category are required.' });
    return;
  }
  const newMerch = {
    id: 'merch-' + Date.now(),
    title,
    fandom,
    category,
    description: description || '',
    image: '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    tags: Array.isArray(tags) ? tags : ['Collectible'],
    status: status || 'available',
    popularity: 80,
    releaseDate: new Date().toISOString().slice(0, 10),
    estimatedPrice: estimatedPrice || 'Showcase Valuation'
  };
  db.merchandise.push(newMerch);
  db.save();
  res.status(201).json({ merchandise: newMerch, message: 'Merchandise showcase item added.' });
});

// ==========================================
// 9. UPCOMING RELEASES WITH COUNTDOWNS
// ==========================================

apiRouter.get('/upcoming', (_req: Request, res: Response) => {
  res.json({ releases: db.upcoming_releases });
});

// ==========================================
// 10. BOOKMARKS & PERSONAL NOTES
// ==========================================

apiRouter.get('/bookmarks', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userBookmarks = db.bookmarks.filter(b => b.userId === req.user!.id);
  res.json({ bookmarks: userBookmarks });
});

apiRouter.post('/bookmarks', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { contentId, contentType, contentTitle, contentImage, fandom, category, notes } = req.body;
  if (!contentId || !contentType || !contentTitle) {
    res.status(400).json({ error: 'Content identifier, type, and title are required.' });
    return;
  }

  const existing = db.bookmarks.find(b => b.userId === req.user!.id && b.contentId === contentId);
  if (existing) {
    // If it already exists, update notes if provided
    if (notes !== undefined) {
      existing.notes = notes;
      db.save();
    }
    res.json({ bookmark: existing, message: 'Bookmark already saved; notes updated.' });
    return;
  }

  const newBookmark: BookmarkDocument = {
    id: 'bm-' + Date.now(),
    userId: req.user!.id,
    contentId,
    contentType,
    contentTitle,
    contentImage: contentImage || '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    fandom: fandom || 'General',
    category: category || 'fandom',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  db.bookmarks.unshift(newBookmark);
  db.logActivity(req.user!.id, req.user!.name, 'BOOKMARK_ADDED', `Bookmarked ${contentTitle}`);
  db.save();

  res.status(201).json({ bookmark: newBookmark, message: 'Added to your universe bookmarks!' });
});

apiRouter.delete('/bookmarks/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const idx = db.bookmarks.findIndex(b => b.id === req.params.id && b.userId === req.user!.id);
  if (idx === -1) {
    // Also check if contentId was passed
    const byContentIdx = db.bookmarks.findIndex(b => b.contentId === req.params.id && b.userId === req.user!.id);
    if (byContentIdx === -1) {
      res.status(404).json({ error: 'Bookmark not found.' });
      return;
    }
    db.bookmarks.splice(byContentIdx, 1);
    db.save();
    res.json({ message: 'Bookmark removed.' });
    return;
  }
  db.bookmarks.splice(idx, 1);
  db.save();
  res.json({ message: 'Bookmark removed.' });
});

apiRouter.patch('/bookmarks/:id/notes', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const bm = db.bookmarks.find(b => b.id === req.params.id && b.userId === req.user!.id);
  if (!bm) {
    res.status(404).json({ error: 'Bookmark not found.' });
    return;
  }
  bm.notes = req.body.notes !== undefined ? req.body.notes : bm.notes;
  db.save();
  res.json({ bookmark: bm, message: 'Personal notes saved.' });
});

// ==========================================
// 11. FAN SUBMISSIONS & APPROVAL WORKFLOW
// ==========================================

apiRouter.get('/submissions/my', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userSubs = db.submissions.filter(s => s.userId === req.user!.id);
  res.json({ submissions: userSubs });
});

apiRouter.post('/submissions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { title, category, fandom, type, summary, content, image } = req.body;
  if (!title || !category || !content) {
    res.status(400).json({ error: 'Title, category, and content are required.' });
    return;
  }

  const newSub: FanSubmissionDocument = {
    id: 'sub-' + Date.now(),
    userId: req.user!.id,
    authorName: req.user!.name,
    authorEmail: req.user!.email,
    title,
    category,
    fandom: fandom || 'General',
    type: type || 'article',
    summary: summary || title,
    content,
    image: image || '/src/assets/images/hero_fandom_universe_1790294495415.jpg',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.submissions.unshift(newSub);
  db.logActivity(req.user!.id, req.user!.name, 'SUBMISSION_CREATED', `Submitted fan content: ${title}`);
  db.save();

  res.status(201).json({ submission: newSub, message: 'Submission submitted for administrator review!' });
});

apiRouter.get('/submissions/admin', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ submissions: db.submissions });
});

apiRouter.patch('/submissions/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, adminFeedback } = req.body;
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    res.status(400).json({ error: 'Status must be pending, approved, or rejected.' });
    return;
  }

  const sub = db.submissions.find(s => s.id === req.params.id);
  if (!sub) {
    res.status(404).json({ error: 'Submission not found.' });
    return;
  }

  sub.status = status;
  if (adminFeedback !== undefined) sub.adminFeedback = adminFeedback;
  sub.reviewedAt = new Date().toISOString();

  // If approved, automatically convert and publish to public articles collection!
  if (status === 'approved') {
    const slug = sub.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const publishedArticle = {
      id: 'art-' + Date.now(),
      title: sub.title,
      slug,
      category: sub.category,
      fandom: sub.fandom,
      author: sub.authorName,
      authorAvatar: '/src/assets/images/fandom_anime_cyber_1790294513680.jpg',
      coverImage: sub.image,
      summary: sub.summary,
      content: sub.content,
      tags: ['Fan Spotlight', sub.category, sub.fandom],
      readTime: '4 min read',
      publishedAt: new Date().toISOString().slice(0, 10),
      views: 1,
      likes: 0,
      isApproved: true
    };
    db.articles.unshift(publishedArticle);
  }

  db.logActivity(req.user!.id, req.user!.name, 'SUBMISSION_REVIEWED', `Marked submission ${sub.id} as ${status}`);
  db.save();

  res.json({ submission: sub, message: `Submission status updated to ${status}.` });
});

// ==========================================
// 12. FEEDBACK SYSTEM
// ==========================================

apiRouter.post('/feedback', (req: Request, res: Response) => {
  const { type, message, userName, userEmail } = req.body;
  if (!type || !message) {
    res.status(400).json({ error: 'Feedback type and message are required.' });
    return;
  }

  if (!['bug', 'suggestion', 'query'].includes(type)) {
    res.status(400).json({ error: 'Type must be bug, suggestion, or query.' });
    return;
  }

  const newFeedback: FeedbackDocument = {
    id: 'fb-' + Date.now(),
    userName: userName || 'Anonymous Fan',
    userEmail: userEmail || 'fan@example.com',
    type,
    message,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.feedback.unshift(newFeedback);
  db.save();

  res.status(201).json({ feedback: newFeedback, message: 'Thank you for your feedback! Our team will review it.' });
});

apiRouter.get('/feedback/admin', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ feedback: db.feedback });
});

apiRouter.patch('/feedback/admin/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, adminReply } = req.body;
  const fb = db.feedback.find(f => f.id === req.params.id);
  if (!fb) {
    res.status(404).json({ error: 'Feedback item not found.' });
    return;
  }

  if (status) fb.status = status;
  if (adminReply !== undefined) fb.adminReply = adminReply;
  fb.updatedAt = new Date().toISOString();
  db.save();

  res.json({ feedback: fb, message: 'Feedback updated.' });
});

// ==========================================
// 13. AI CHATBOT & KNOWLEDGE BASE (Grounding in Database)
// ==========================================

apiRouter.get('/chatbot/faqs', (_req: Request, res: Response) => {
  res.json({ faqs: db.faqs });
});

apiRouter.post('/feedback', (req: Request, res: Response) => {
  const { type, message, userName, userEmail } = req.body;
  if (!type || !message) {
    res.status(400).json({ error: 'Feedback type and message are required.' });
    return;
  }

  if (!['bug', 'general', 'feature', 'content'].includes(type)) {
    res.status(400).json({ error: 'Invalid feedback type.' });
    return;
  }

const newFeedback = {
  id: crypto.randomBytes(8).toString('hex'),
  type: req.body.type,
  message: req.body.message,
  userName: req.body.userName || 'Anonymous',
  userEmail: req.body.userEmail || '',
  createdAt: new Date().toISOString(),
  status: 'pending',
  updatedAt: new Date().toISOString()
};

db.feedback.unshift(newFeedback as any);
db.save();
res.status(201).json({ message: 'Thank you for your feedback!' });
});

apiRouter.get('/admin/analytics', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const totalUsers = db.users.length;
  const activeUsers = db.users.filter(u => u.isActive).length;
  const totalArticles = db.articles.length;
  const totalCharacters = db.characters.length;
  const totalMedia = db.media.length;
  const totalEvents = db.events.length;
  const totalMerchandise = db.merchandise.length;
  const recentLogs = db.activity_logs.slice(0, 15);

  res.json({
    metrics: {
      totalUsers,
      activeUsers,
      totalArticles,
      totalCharacters,
      totalMedia,
      totalEvents,
      totalMerchandise
    },
    recentLogs
  });
});