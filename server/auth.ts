import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Authenticated Request interface
export interface AuthenticatedRequest extends Request {
  user?: any;
}

// 1. Mongoose User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: String, default: 'user' },
  avatar: { type: String },
  favoriteFandoms: [String]
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// In-memory active sessions storage
const activeSessions = new Map();

// Password secure hashing function (Node.js built-in crypto)
function hashPassword(password: string, existingSalt?: string) {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

// Session token management functions
export function createSessionToken(user: any): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, user);
  return token;
}

export function removeSessionToken(token: string): void {
  activeSessions.delete(token);
}

export function getUserByToken(token: string): any {
  return activeSessions.get(token);
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const user = getUserByToken(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  (req as any).user = user;
  next();
}

// Admin authorization middleware
export function requireAdmin(req: Request, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  const user = getUserByToken(token);
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  (req as any).user = user;
  next();
}

// 2. Signup Route
export async function handleSignup(req: Request, res: Response) {
  console.log("--> Signup API hit hui! Data mila:", req.body);
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const { salt, hash } = hashPassword(password);

    const newUser = new User({
      name,
      email,
      passwordHash: hash,
      salt,
      role: 'user',
      favoriteFandoms: []
    });

    await newUser.save();
    const token = createSessionToken(newUser);

    res.status(201).json({ 
      message: 'User registered successfully in MongoDB Atlas!',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
}

// 3. Login Route
export async function handleLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const { hash } = hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = createSessionToken(user);

    res.json({
      message: 'Logged in successfully from MongoDB Atlas!',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
}