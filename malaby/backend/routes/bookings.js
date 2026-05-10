const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Pitch = require('../models/Pitch');
const Notification = require('../models/Notification');

// ==================== HELPER FUNCTIONS ====================

function addHoursToTime(timeStr, hoursToAdd) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + (hoursToAdd * 60);
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function hasTimeOverlap(start1, duration1, start2, duration2) {
  const end1 = addHoursToTime(start1, duration1);
  const end2 = addHoursToTime(start2, duration2);

  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return (start1Min < end2Min && end1Min > start2Min);
}

// ==================== MIDDLEWARE ====================

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

// ==================== ROUTES ====================

// @desc    Get available time slots for a pitch on a specific date
// @route   GET /api/bookings/availability
// @access  Public
router.get('/availability', async (req, res, next) => {
  try {
    const { pitchId, date, duration = 1 } = req.query;

    if (!pitchId || !date) {
      return res.status(400).json({
        success: false,
        message: 'pitchId and date are required'
      });
    }

    const requestedDuration = parseInt(duration) || 1;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Only confirmed bookings block availability — pending bookings do NOT block slots
    const confirmedBookings = await Booking.find({
      pitch: pitchId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['confirmed', 'completed'] }
    });

    const slots = [];
    const maxStartHour = 24 - requestedDuration;

    for (let hour = 0; hour <= maxStartHour; hour++) {
      const timeStr = `${String(hour).padStart(2, '0')}:00`;
      const endTime = addHoursToTime(timeStr, requestedDuration);

      const conflicting = confirmedBookings.filter(b =>
        hasTimeOverlap(timeStr, requestedDuration, b.timeSlot, b.duration)
      );

      slots.push({
        time: timeStr,
        endTime,
        isAvailable: conflicting.length === 0,
        conflictsWith: conflicting.map(b => ({
          from: b.timeSlot,
          to: addHoursToTime(b.timeSlot, b.duration)
        }))
      });
    }

    const bookedRanges = confirmedBookings.map(b => ({
      from: b.timeSlot,
      to: addHoursToTime(b.timeSlot, b.duration)
    }));

    res.status(200).json({
      success: true,
      data: { slots, bookedRanges, date }
    });
  } catch (error) {
    next(error);
  }
});

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

      const pitch = await Pitch.findById(pitchId);
      if (!pitch) {
        return res.status(404).json({
          success: false,
          message: 'Pitch not found'
        });
      }

      // Only check overlap against confirmed bookings — multiple pending bookings can coexist
      const confirmedBookings = await Booking.find({
        pitch: pitchId,
        bookingDate: new Date(bookingDate),
        status: { $in: ['confirmed', 'completed'] }
      });

      const requestedDuration = duration || 1;

      const overlappingBooking = confirmedBookings.find(booking =>
        hasTimeOverlap(timeSlot, requestedDuration, booking.timeSlot, booking.duration)
      );

      if (overlappingBooking) {
        const existingEnd = addHoursToTime(overlappingBooking.timeSlot, overlappingBooking.duration);
        return res.status(400).json({
          success: false,
          message: `This time slot is already booked (${overlappingBooking.timeSlot} - ${existingEnd}). Please select another time.`
        });
      }

      const totalPrice = pitch.pricePerHour * requestedDuration;

      const booking = await Booking.create({
        pitch: pitchId,
        customerName,
        customerEmail,
        customerPhone,
        bookingDate: new Date(bookingDate),
        timeSlot,
        duration: requestedDuration,
        totalPrice,
        paymentMethod: paymentMethod || 'vodafone_cash',
        notes
      });

      await booking.populate('pitch');

      const bookingEnd = addHoursToTime(timeSlot, requestedDuration);
      await Notification.create({
        booking: booking._id,
        title: 'New Booking Received',
        message: `${customerName} booked ${pitch.name} on ${new Date(bookingDate).toLocaleDateString('en-GB')} at ${timeSlot} - ${bookingEnd}`,
        type: 'new_booking'
      });

      res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully'
      });
    } catch (error) {
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

    if (status === 'confirmed') {
      const bookingToConfirm = await Booking.findById(req.params.id);

      if (!bookingToConfirm) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check overlap against other already-confirmed bookings only
      const otherConfirmedBookings = await Booking.find({
        pitch: bookingToConfirm.pitch,
        bookingDate: bookingToConfirm.bookingDate,
        status: { $in: ['confirmed', 'completed'] },
        _id: { $ne: bookingToConfirm._id }
      });

      const overlappingBooking = otherConfirmedBookings.find(booking =>
        hasTimeOverlap(
          bookingToConfirm.timeSlot,
          bookingToConfirm.duration,
          booking.timeSlot,
          booking.duration
        )
      );

      if (overlappingBooking) {
        const existingEnd = addHoursToTime(overlappingBooking.timeSlot, overlappingBooking.duration);
        return res.status(400).json({
          success: false,
          message: `Cannot confirm: overlaps with an already confirmed booking (${overlappingBooking.timeSlot} - ${existingEnd})`
        });
      }
    }

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
