const express = require('express');
const router = express.Router();
const Pitch = require('../models/Pitch');
const Booking = require('../models/Booking');
const { to24Hour, utcDayRange } = require('../utils/time');
const { escapeRegex } = require('../utils/security');

// @desc    Get all pitches
// @route   GET /api/pitches
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { search, minPrice, maxPrice, location } = req.query;
    let query = { isActive: true };

    if (search) {
      const safeSearch = escapeRegex(String(search).slice(0, 100));
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: escapeRegex(String(location).slice(0, 100)), $options: 'i' };
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

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const { start, end } = utcDayRange(date);
    const dayName = dayNames[start.getUTCDay()];

    const dayAvailability = pitch.availability.find(a => a.day === dayName);

    if (!dayAvailability) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Only confirmed bookings block slots — pending bookings do NOT block slots
    const bookings = await Booking.find({
      pitch: req.params.id,
      bookingDate: { $gte: start, $lte: end },
      status: { $in: ['confirmed', 'completed'] }
    });

    const bookedSlots = bookings.map(b => to24Hour(b.timeSlot));

    const availableSlots = dayAvailability.slots.filter(
      slot => !bookedSlots.includes(to24Hour(slot.time)) && slot.available
    );

    res.status(200).json({
      success: true,
      data: availableSlots.map(s => to24Hour(s.time))
    });
  } catch (error) {
    res.status(200).json({ success: true, data: [] });
  }
});

module.exports = router;
