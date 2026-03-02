/**
 * ============================================================================
 * POST MODEL
 * ============================================================================
 * 
 * Represents a blog post or social media post created by a user
 * 
 * Fields:
 * - id: Unique identifier (auto-generated)
 * - title: Post title
 * - content: Post content/body
 * - userId: Foreign key to Auth table (who created this post)
 * - createdAt: When the post was created (auto)
 * - updatedAt: When the post was last updated (auto)
 * 
 * ============================================================================
 * WHY REFERENCE Auth TABLE INSTEAD OF User TABLE?
 * ============================================================================
 * 
 * The userId in Post should reference the Auth table because:
 * 
 * 1. AUTH = User Accounts (Email, Password)
 *    - Auth table contains ALL registered users
 *    - Every user who can create posts is in Auth table
 *    - Auth is the source of truth for "who exists"
 * 
 * 2. USER = User Profile (Name, Email, Photos)
 *    - User table is optional/profile info
 *    - Not all Auth users must have User profile
 *    - User table might have gaps
 * 
 * 3. DATA INTEGRITY
 *    - If we link to User table:
 *      → Some posts might reference non-existent users
 *      → Integrity broken!
 *    - If we link to Auth table:
 *      → All posts linked to real accounts
 *      → Clean data!
 * 
 * 4. CASCADE DELETE
 *    - When user account deleted (from Auth)
 *    - All their posts should delete (CASCADE)
 *    - This only works if userId references Auth!
 * 
 * So both Post and Comment reference Auth for consistency!
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/Sequelize.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Unique identifier for the post'
  },
  
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Title of the post'
  },
  
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Full content/body of the post'
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Auth',         // References the Auth table (user accounts)
      key: 'id'              // The id column
    },
    comment: 'Foreign key: Links to the User who created this post'
  }
}, {
  tableName: 'posts',
  timestamps: true,        // Adds createdAt and updatedAt automatically
  comment: 'Stores blog posts or social media posts'
});

export default Post;

