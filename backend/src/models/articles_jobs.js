const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  authorName: {
    type: String,
    required: true
  },

  authorBatch: {
    type: Number,
    default: null
  },

  postType: {
    type: String,
    enum: ['article', 'job'],
    required: true
  },

  // Shared fields
  title: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    unique: true,
    sparse: true   // only for articles
  },

  isPublished: {
    type: Boolean,
    default: true
  },

  // Article fields
  body: {
    type: String,
    required: function () {
      return this.postType === 'article';
    }
  },

  coverImageUrl: {
    type: String,
    default: null
  },

  category: {
    type: String,
    enum: ['college_news', 'alumni_stories', 'achievements', 'announcements'],
    required: function () {
      return this.postType === 'article';
    }
  },

  // Job fields
  company: {
    type: String,
    required: function () {
      return this.postType === 'job';
    }
  },

  location: {
    type: String,
    required: function () {
      return this.postType === 'job';
    }
  },

  isRemote: {
    type: Boolean,
    default: false
  },

  jobType: {
    type: String,
    enum: ['full_time', 'part_time', 'internship']
  },

  salaryMin: {
    type: Number,
    default: null
  },

  salaryMax: {
    type: Number,
    default: null
  },

  description: {
    type: String,
    required: function () {
      return this.postType === 'job';
    }
  },

  applyLink: {
    type: String,
    required: function () {
      return this.postType === 'job';
    }
  },

  expiresAt: {
    type: Date
  }

}, {
  timestamps: true
});