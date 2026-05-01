const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const getProjects = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (req.user.role !== 'admin') {
      query.$or = [{ owner: req.user._id }, { members: req.user._id }];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) query.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [projects, total] = await Promise.all([
      Project.find(query)
        .populate('owner', 'name email avatar')
        .populate('members', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(query),
    ]);

    const projectIds = projects.map((p) => p._id);
    const taskCounts = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$project',
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        },
      },
    ]);

    const countMap = {};
    taskCounts.forEach((t) => {
      countMap[t._id.toString()] = { total: t.total, completed: t.completed };
    });

    const enriched = projects.map((p) => {
      const counts = countMap[p._id.toString()] || { total: 0, completed: 0 };
      const progress = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
      return { ...p.toObject(), taskCount: counts.total, completedCount: counts.completed, progress };
    });

    res.json({
      success: true,
      data: enriched,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    if (!project) return res.status(404).json({ success: false, message: 'Not found' });

    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some((m) => m._id.toString() === req.user._id.toString());
    if (req.user.role !== 'admin' && !isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Denied' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { name, description, status, priority, deadline, members, color, tags } = req.body;

    const project = await Project.create({
      name, description, status, priority, deadline, color, tags,
      owner: req.user._id,
      members: members || [],
    });

    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    if (members?.length) {
      await User.updateMany(
        { _id: { $in: members } },
        {
          $push: {
            notifications: {
              message: `New project: ${name}`,
              type: 'info',
            },
          },
        }
      );
    }

    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ success: false, message: 'Denied' });
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Not found' });

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ success: false, message: 'Denied' });
    }

    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
