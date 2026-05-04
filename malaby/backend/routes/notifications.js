const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// @desc    Get all notifications (Admin)
// @route   GET /api/notifications
// @access  Admin
router.get('/', async (req, res, next) => {
  try {
    const { read, type } = req.query;
    let query = {};

    if (read !== undefined) query.read = read === 'true';
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .populate({
        path: 'booking',
        populate: {
          path: 'pitch',
          select: 'name location'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount: notifications.filter(n => !n.read).length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Admin
router.get('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate({
        path: 'booking',
        populate: {
          path: 'pitch',
          select: 'name location pricePerHour'
        }
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Admin
router.put('/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true, readAt: new Date() },
      { new: true }
    ).populate({
      path: 'booking',
      populate: {
        path: 'pitch',
        select: 'name location'
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Admin
router.put('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { read: false },
      { read: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Admin
router.delete('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/stats/unread
// @access  Admin
router.get('/stats/unread', async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ read: false });

    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
