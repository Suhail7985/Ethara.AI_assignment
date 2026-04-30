const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc    Get all users (admin) or team members
// @route   GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).select('-password -notifications').sort({ name: 1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Invite / update user role (admin only)
// @route   POST /api/users/invite
const inviteUser = async (req, res, next) => {
  try {
    const { email, role = 'member', name } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

    let user = await User.findOne({ email });
    if (user) {
      // Update role if already exists
      user.role = role;
      await user.save({ validateBeforeSave: false });
      return res.json({ success: true, message: `User role updated to ${role}.`, data: user });
    }

    // Create a placeholder account
    const tempPassword = Math.random().toString(36).slice(-10);
    user = await User.create({ name: name || email.split('@')[0], email, password: tempPassword, role });

    res.status(201).json({
      success: true,
      message: 'User invited. Share their temporary password.',
      data: user,
      tempPassword,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { name, role, isActive, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, isActive, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Get notifications for current user
// @route   GET /api/users/notifications
const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.json({ success: true, data: user.notifications.reverse() });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:notifId/read
const markNotificationRead = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user._id, 'notifications._id': req.params.notifId },
      { $set: { 'notifications.$.read': true } }
    );
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Dashboard analytics
// @route   GET /api/users/analytics
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Project filter
    const projectFilter = isAdmin
      ? {}
      : { $or: [{ owner: userId }, { members: userId }] };

    const projects = await Project.find(projectFilter).select('_id status');
    const projectIds = projects.map((p) => p._id);

    const taskFilter = isAdmin 
      ? {} 
      : { 
          $or: [
            { project: { $in: projectIds } }, 
            { assignedTo: userId }
          ] 
        };

    const [totalProjects, taskStats, recentTasks, overdueCount] = await Promise.all([
      Project.countDocuments(projectFilter),
      Task.aggregate([
        { $match: taskFilter },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Task.find(isAdmin ? taskFilter : { ...taskFilter, assignedTo: userId })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('project', 'name color')
        .populate('assignedTo', 'name'), // Exclude avatar from analytics tasks
      Task.countDocuments({
        ...taskFilter,
        dueDate: { $lt: new Date() },
        status: { $ne: 'completed' },
      }),
    ]);

    // Weekly tasks completed (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyCompleted = await Task.aggregate([
      {
        $match: {
          ...taskFilter,
          status: 'completed',
          completedAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$completedAt' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Team workload (active tasks per user)
    const teamWorkload = await Task.aggregate([
      { $match: { ...taskFilter, status: { $ne: 'completed' }, assignedTo: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          count: 1
          // Exclude avatar from workload aggregation
        }
      }
    ]);

    const statusMap = {};
    taskStats.forEach((s) => (statusMap[s._id] = s.count));
    const totalTasks = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const completed = statusMap['completed'] || 0;
    const productivity = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        completed,
        inProgress: statusMap['in-progress'] || 0,
        todo: statusMap['todo'] || 0,
        review: statusMap['review'] || 0,
        overdue: overdueCount,
        productivity,
        taskStatusBreakdown: taskStats,
        weeklyCompleted,
        recentTasks,
        teamWorkload
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, getUserById, inviteUser, updateUser, getNotifications, markNotificationRead, getAnalytics };
