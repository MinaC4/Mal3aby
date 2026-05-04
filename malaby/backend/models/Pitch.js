const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

const dayAvailabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  slots: [timeSlotSchema]
});

const pitchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pitch name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  images: [{
    type: String,
    required: true
  }],
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: 0
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  amenities: [{
    type: String
  }],
  availability: [dayAvailabilitySchema],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pitch', pitchSchema);
