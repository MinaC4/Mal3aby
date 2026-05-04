const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  pitch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pitch',
    required: [true, 'Pitch is required']
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
    lowercase: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  duration: {
    type: Number,
    default: 1,
    min: 1,
    max: 4
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentScreenshot: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['vodafone_cash', 'instapay', 'cash'],
    default: 'vodafone_cash'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for preventing double bookings
bookingSchema.index({ pitch: 1, bookingDate: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
