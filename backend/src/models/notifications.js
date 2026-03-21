const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'referral_request', 
      'referral_response', 
      'new_job', 
      'welcome', 
      'connect_email'
    ]
  },
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

// Triple Compound Index for optimized notification feed:
// Filter by user, filter by read status, sort by newest first.
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;