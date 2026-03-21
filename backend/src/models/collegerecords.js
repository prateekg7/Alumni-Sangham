const mongoose = require('mongoose');

const collegeRecordSchema = new mongoose.Schema({

  rollNumber: {
    type: String,
    required: true
  },

  enrollmentNumber: {
    type: String,
    default: null
  },

  name: {
    type: String,
    required: true
  },

  department: {
    type: String,
    required: true
  },

  batchYear: {
    type: Number,
    required: true
  },

  recordType: {
    type: String,
    enum: ['alumni', 'student'],
    required: true
  }

}, {
  timestamps: { createdAt: true, updatedAt: false } // only createdAt
});