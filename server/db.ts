/**
 * Database abstraction layer for Fan Hub Plus.
 * Connects Fan Hub Plus to MongoDB Atlas.
 */

import mongoose from 'mongoose';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    '❌ MONGO_URI is missing. Please add MONGO_URI to your .env file.'
  );
}

// ===============================
// MongoDB Connection
// ===============================

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const connection = await mongoose.connect(MONGO_URI, {
      dbName: 'FanHub'
    });

    isConnected = true;

    console.log('=================================');
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📦 Database: ${connection.connection.name}`);
    console.log(`🌐 Host: ${connection.connection.host}`);
    console.log('=================================');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed');
    console.error(error.message);
    throw error;
  }
};

// ===============================
// User Schema
// ===============================

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    salt: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['visitor', 'user', 'admin'],
      default: 'user'
    },

    avatar: {
      type: String,
      default: ''
    },

    favoriteFandoms: {
      type: [String],
      default: []
    },

    favoriteCategories: {
      type: [String],
      default: []
    },

    displayPreferences: {
      theme: {
        type: String,
        default: 'dark'
      },

      fontSize: {
        type: String,
        default: 'normal'
      },

      emailNotifications: {
        type: Boolean,
        default: true
      }
    },

    isActive: {
      type: Boolean,
      default: true
    },

    resetToken: {
      type: String,
      default: null
    },

    resetTokenExpires: {
      type: Number,
      default: null
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    collection: 'users',
    versionKey: false
  }
);

// ===============================
// User Model
// ===============================

const UserModel =
  mongoose.models.FanHubUser ||
  mongoose.model('FanHubUser', userSchema);

export { UserModel };