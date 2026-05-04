const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Pitch = require('../models/Pitch');
const Notification = require('../models/Notification');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }
  next();
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
router.post(
  '/',
  [
    body('pitchId').notEmpty().withMessage('Pitch is required'),
    body('customerName').notEmpty().trim().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('Valid email is required'),
    body('customerPhone').notEmpty().trim().withMessage('Phone number is required'),
    body('bookingDate').notEmpty().withMessage('Booking date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    validate
  ],
  async (req, res, next) => {
    try {
      const { pitchId, customerName, customerEmail, customerPhone, bookingDate, timeSlot, duration, paymentMethod, notes } = req.body;

      // Check if pitch exists
      const pitch = await Pitch.findById(pitchId);
      if (!pitch) {
        return res.status(404).json({
          success: false,
          message: 'Pitch not found'
        });
      }

      // Calculate total price
      const bookingDuration = duration || 1;
      const totalPrice = pitch.pricePerHour * bookingDuration;

      // Create booking
      const booking = await Booking.create({
        pitch: pitchId,
        customerName,
        customerEmail,
        customerPhone,
        bookingDate: new Date(bookingDate),
        timeSlot,
        duration: bookingDuration,
        totalPrice,
        paymentMethod: paymentMethod || 'vodafone_cash',
        notes
      });

      // Populate pitch data
      await booking.populate('pitch');

      // Create notification for admin
      await Notification.create({
        booking: booking._id,
        title: 'New Booking Received',
        message: `${customerName} booked ${pitch.name} on ${new Date(bookingDate).toLocaleDateString('en-GB')} at ${timeSlot}`,
        type: 'new_booking'
      });

      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully'
      });
    } catch (error) {
      // Handle duplicate booking
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'This time slot is already booked. Please select another time.'
        });
      }
      next(error);
    }
  }
);

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Admin
router.get('/', async (req, res, next) => {
  try {
    const { status, date, pitchId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (pitchId) query.pitch = pitchId;
    if (date) {
      const searchDate = new Date(date);
      query.bookingDate = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    }

    const bookings = await Booking.find(query)
      .populate('pitch', 'name location pricePerHour images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Admin
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('pitch');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Admin
router.put('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('pitch');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create notification for status change
    const notificationType = status === 'confirmed' ? 'booking_confirmed' : 
                            status === 'cancelled' ? 'booking_cancelled' : 'new_booking';
    
    await Notification.create({
      booking: booking._id,
      title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Booking for ${booking.customerName} has been ${status}`,
      type: notificationType
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Upload payment screenshot
// @route   PUT /api/bookings/:id/payment
// @access  Public
router.put('/:id/payment', async (req, res, next) => {
  try {
    const { paymentScreenshotUrl } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        paymentScreenshot: paymentScreenshotUrl,
        status: 'pending'
      },
      { new: true }
    ).populate('pitch');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Create notification for payment
    await Notification.create({
      booking: booking._id,
      title: 'Payment Screenshot Uploaded',
      message: `${booking.customerName} uploaded payment screenshot for booking`,
      type: 'payment_received'
    });

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Payment screenshot uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Admin
router.delete('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
