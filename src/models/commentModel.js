/**
 * ============================================================================
 * COMMENT MODEL
 * ============================================================================
 * 
 * Represents a comment written by a user on a post
 * 
 * Fields:
 * - id: Unique identifier (auto-generated)
 * - text: The comment content
 * - userId: Foreign key to Auth table (who wrote the comment)
 * - postId: Foreign key to Post (which post this comment is on)
 * - createdAt: When the comment was created (auto)
 * - updatedAt: When the comment was last updated (auto)
 * 
 * ============================================================================
 * WHY REFERENCE Auth TABLE INSTEAD OF User TABLE?
 * ============================================================================
 * 
 * The userId references Auth table because:
 * 
 * 1. AUTH = User Accounts (guaranteed to exist)
 *    - Every logged-in user is in Auth table
 *    - Can't create comment without Auth account
 * 
 * 2. USER = User Profile (optional)
 *    - User might register but not fill profile
 *    - User table might have gaps
 * 
 * 3. DATA INTEGRITY
 *    - If linked to User table → Some comments might orphan
 *    - If linked to Auth table → All comments have real accounts
 * 
 * 4. CONSISTENCY
 *    - Both Post and Comment reference Auth
 *    - Cleaner, more consistent architecture
 */

import { DataTypes } from 'sequelize';
import sequelize from '../config/Sequelize.js';

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: 'Unique identifier for the comment'
  },
  
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The comment text/content'
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Auth',         // References the Auth table (user accounts)
      key: 'id'
    },
    comment: 'Foreign key: Links to the User who wrote this comment'
  },
  
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',        // References the posts table
      key: 'id'
    },
    comment: 'Foreign key: Links to the Post this comment is on'
  }
}, {
  tableName: 'comments',
  timestamps: true,        // Adds createdAt and updatedAt automatically
  comment: 'Stores comments on posts'
});

export default Comment;

