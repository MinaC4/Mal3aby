const express = require('express');
const router = express.Router();
const Pitch = require('../models/Pitch');
const Booking = require('../models/Booking');

// @desc    Get all pitches
// @route   GET /api/pitches
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice, location } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
    }

    const pitches = await Pitch.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pitches.length,
      data: pitches
    });
  } catch (error) {
    res.status(200).json({ success: true, count: 0, data: [] });
  }
});

// @desc    Get single pitch
// @route   GET /api/pitches/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const pitch = await Pitch.findById(req.params.id);

    if (!pitch) {
      return res.status(404).json({
        success: false,
        message: 'Pitch not found'
      });
    }

    res.status(200).json({ success: true, data: pitch });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pitch details'
    });
  }
});

// @desc    Get available time slots for a pitch on a specific date
// @route   GET /api/pitches/:id/slots
// @access  Public
router.get('/:id/slots', async (req, res, next) => {
  try {
    const { date } = req.query;
    const pitch = await Pitch.findById(req.params.id);

    if (!pitch) {
      return res.status(404).json({ success: false, message: 'Pitch not found' });
    }

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const selectedDate = new Date(date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[selectedDate.getDay()];

    const dayAvailability = pitch.availability.find(a => a.day === dayName);

    if (!dayAvailability) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Only confirmed bookings block slots — pending bookings do NOT block slots
    const bookings = await Booking.find({
      pitch: req.params.id,
      bookingDate: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(selectedDate.setHours(23, 59, 59, 999))
      },
      status: { $in: ['confirmed', 'completed'] }
    });

    const bookedSlots = bookings.map(b => b.timeSlot);

    const availableSlots = dayAvailability.slots.filter(
      slot => !bookedSlots.includes(slot.time) && slot.available
    );

    res.status(200).json({
      success: true,
      data: availableSlots.map(s => s.time)
    });
  } catch (error) {
    res.status(200).json({ success: true, data: [] });
  }
});

module.exports = router;
