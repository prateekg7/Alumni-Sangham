const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true
  },

  fullName: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['alumni', 'student'],
    required: true
  },

  // Alumni-specific
  batchYear: {
    type: Number,
    default: null
  },

  rollNumber: {
    type: String,
    default: null
  },

  currentJobTitle: {
    type: String,
    default: null
  },

  currentCompany: {
    type: String,
    default: null
  },

  industry: {
    type: String,
    default: null
  },

  // Student-specific
  currentYear: {
    type: Number,
    default: null
  },

  enrollmentNumber: {
    type: String,
    default: null
  },

  interests: {
    type: [String],
    default: []
  },

  // Shared fields
  department: {
    type: String,
    required: true
  },

  linkedinUrl: {
    type: String,
    default: null
  },

  photoUrl: {
    type: String,
    default: null
  },

  city: {
    type: String,
    default: null
  },

  country: {
    type: String,
    default: null
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: undefined
    }
  },

  showEmail: {
    type: Boolean,
    default: false
  },

  showInDirectory: {
    type: Boolean,
    default: true
  },

  showOnMap: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true
});
