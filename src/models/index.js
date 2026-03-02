/**
 * ============================================================================
 * MODEL ASSOCIATIONS - Database Relationships Configuration
 * ============================================================================
 * 
 * This file defines the relationships between different database tables/models
 * so Sequelize knows how to join data from multiple tables.
 * 
 * Association Types:
 * - One-to-Many (hasMany): One parent has multiple children
 * - One-to-One (hasOne): One parent has only one child
 * - Many-to-Many (belongsToMany): Multiple items can have multiple items
 * 
 * ============================================================================
 */

import User from './userModel.js';
import Auth from './authModel.js';
import Post from './postModel.js';
import Comment from './commentModel.js';

// ============================================================================
// EXAMPLE: ONE-TO-MANY ASSOCIATION (Auth has many Posts)
// ============================================================================
/**
 * A User (from Auth) can create multiple Posts, but each Post belongs to only one User
 * 
 * Relationships created:
 * - auth.getPosts() - Get all posts by this user
 * - auth.createPost() - Create a new post for this user
 * - post.getAuth() - Get the user who created this post
 */
Auth.hasMany(Post, {
  foreignKey: 'userId',      // Column in Post table that references Auth
  as: 'posts',               // Alias for easier querying
  onDelete: 'CASCADE'        // Delete all posts if user is deleted
});

Post.belongsTo(Auth, {
  foreignKey: 'userId',      // Which column to use as foreign key
  as: 'author'               // Alias for the associated user
});

// ============================================================================
// EXAMPLE: ONE-TO-MANY ASSOCIATION (Post has many Comments)
// ============================================================================
/**
 * A Post can have multiple Comments, but each Comment belongs to only one Post
 * 
 * Relationships created:
 * - post.getComments() - Get all comments on this post
 * - post.createComment() - Add a comment to this post
 * - comment.getPost() - Get the post this comment is on
 */
Post.hasMany(Comment, {
  foreignKey: 'postId',      // Column in Comment table that references Post
  as: 'comments',            // Alias for easier querying
  onDelete: 'CASCADE'        // Delete all comments if post is deleted
});

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post'
});

// ============================================================================
// EXAMPLE: ONE-TO-MANY ASSOCIATION (Auth has many Comments)
// ============================================================================
/**
 * A User (from Auth) can write multiple Comments, but each Comment is by only one User
 * 
 * Relationships created:
 * - auth.getComments() - Get all comments by this user
 * - comment.getAuth() - Get the user who wrote this comment
 */
Auth.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'CASCADE'
});

Comment.belongsTo(Auth, {
  foreignKey: 'userId',
  as: 'author'              // The user who wrote the comment
});

// ============================================================================
// MANY-TO-MANY ASSOCIATION EXAMPLE (if needed in future)
// ============================================================================
/**
 * UNCOMMENT WHEN YOU HAVE A "LIKES" OR "FAVORITES" TABLE
 * 
 * A User can like/favorite many Posts, and a Post can be liked by many Users
 * This requires a junction table (e.g., 'UserPostLike' or 'UserPostFavorite')
 * 
 * const UserPostLike = sequelize.define('UserPostLike', {
 *   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
 * });
 * 
 * User.belongsToMany(Post, {
 *   through: UserPostLike,
 *   foreignKey: 'userId',
 *   otherKey: 'postId',
 *   as: 'likedPosts'
 * });
 * 
 * Post.belongsToMany(User, {
 *   through: UserPostLike,
 *   foreignKey: 'postId',
 *   otherKey: 'userId',
 *   as: 'likedByUsers'
 * });
 */

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Get a user (from Auth) with all their posts
 * ─────────────────────────────────────────────────────
 * const user = await Auth.findByPk(1, {
 *   include: [{
 *     association: 'posts',      // Use the alias we defined
 *     include: [{
 *       association: 'comments'   // Include nested comments
 *     }]
 *   }]
 * });
 * 
 * Result:
 * {
 *   id: 1,
 *   email: 'john@example.com',
 *   posts: [
 *     {
 *       id: 1,
 *       title: 'My Post',
 *       comments: [
 *         { id: 1, text: 'Great post!' }
 *       ]
 *     }
 *   ]
 * }
 */

/**
 * EXAMPLE 2: Get all posts with their authors (from Auth) and comments
 * ────────────────────────────────────────────────────────────────────
 * const posts = await Post.findAll({
 *   include: [
 *     { association: 'author' },      // Include Auth user info
 *     { association: 'comments' }     // Include all comments
 *   ]
 * });
 */

/**
 * EXAMPLE 3: Create a post for a user (from Auth)
 * ──────────────────────────────────────────────jfjif0** const user = await Auth.findByPk(1);
 * const newPost = await user.createPost({
 *   title: 'New Post',
 *   content: 'This is great!'
 * });
 * // newPost will automatically have userId = 1 (links to Auth.id)
 */

/**
 * EXAMPLE 4: Get all comments by a user (from Auth)
 * ────────────────────────────────────────────────
 * const user = await Auth.findByPk(1);
 * const userComments = await user.getComments();
 */

// ============================================================================
// IMPORTANT NOTES
// ============================================================================

/**
 * 1. FOREIGN KEYS
 *    - foreignKey: The column in the child table that references the parent
 *    - Make sure this column exists in your model definition
 *
 * 2. ALIASES (as property)
 *    - Makes querying easier: include: { association: 'posts' }
 *    - Without alias: include: [Post] (less readable)
 *
 * 3. CASCADE ACTIONS
 *    - onDelete: 'CASCADE' - Deletes all child records when parent is deleted
 *    - onDelete: 'SET NULL' - Sets foreign key to NULL when parent deleted
 *    - onDelete: 'RESTRICT' - Prevents deletion of parent if children exist
 *
 * 4. EAGER LOADING
 *    - include: [...] loads related data in one query (better performance)
 *    - Without include: Need separate queries for each relationship
 *
 * 5. LAZY LOADING (if needed)
 *    - user.getPosts() - Loads posts after user is fetched
 *    - Less efficient but useful for conditional loading
 */

// ============================================================================
// EXPORT MODELS
// ============================================================================

export { User, Auth, Post, Comment };
