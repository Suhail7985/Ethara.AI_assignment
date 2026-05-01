const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

const checkProjectAccess = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Not found', status: 404 };
  const isOwner = project.owner.toString() === user._id.toString();
  const isMember = project.members.map(String).includes(user._id.toString());
  if (user.role !== 'admin' && !isOwner && !isMember) {
    return { error: 'Denied', status: 403 };
  }
  return { project };
};

const getTasks = async (req, res, next) => {
  try {
    const { project, status, priority, assignedTo, search, page = 1, limit = 50, overdue } = req.query;
    const query = {};

    if (project) query.project = project;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'completed' };
    }

    if (req.user.role !== 'admin') {
      const accessibleProjects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      }).select('_id');
      const projectIds = accessibleProjects.map((p) => p._id);

      if (project) {
        if (!projectIds.map(String).includes(String(project))) {
          query.assignedTo = req.user._id;
        }
      } else {
        query.$or = [
          { project: { $in: projectIds } },
          { assignedTo: req.user._id }
        ];
      }
    }

    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assignedTo', 'name email avatar')
        .populate('createdBy', 'name email avatar')
        .populate('project', 'name color')
        .populate('comments.user', 'name avatar')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Task.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: tasks,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color owner members')
      .populate('comments.user', 'name avatar');

    if (!task) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    if (req.body.assignedTo === '') delete req.body.assignedTo;
    const { title, description, project, assignedTo, status, priority, dueDate, tags, order } = req.body;

    const access = await checkProjectAccess(project, req.user);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    const task = await Task.create({
      title, description, project, assignedTo, status, priority, dueDate, tags, order,
      createdBy: req.user._id,
      activity: [{ user: req.user._id, action: 'created', details: 'Created' }]
    });

    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name color');

    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: {
          notifications: {
            message: `Assigned: ${title}`,
            type: 'info',
          },
        },
      });

      const io = req.app.get('io');
      if (io) {
        io.to(assignedTo).emit('notification', {
          message: `Assigned: ${title}`,
          type: 'info',
          createdAt: new Date()
        });
      }
    }

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    if (req.body.assignedTo === '') req.body.assignedTo = null;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Not found' });

    const isAssigned = task.assignedTo?.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (req.user.role !== 'admin' && !isAssigned && !isCreator) {
      const project = await Project.findById(task.project);
      const isProjectOwner = project?.owner.toString() === req.user._id.toString();
      const isProjectMember = project?.members.map(String).includes(req.user._id.toString());

      if (!isProjectOwner && !isProjectMember) {
        return res.status(403).json({ success: false, message: 'Denied' });
      }
    }

    if (req.user.role !== 'admin' && req.body.assignedTo && req.body.assignedTo !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Admin only' });
    }

    const activityLog = [];
    if (req.body.status && req.body.status !== task.status) {
      activityLog.push({
        user: req.user._id,
        action: 'status_change',
        details: `Updated: ${req.body.status}`
      });
    }
    if (req.body.assignedTo !== undefined && String(req.body.assignedTo) !== String(task.assignedTo)) {
      activityLog.push({
        user: req.user._id,
        action: 'assignment',
        details: req.body.assignedTo ? 'Assigned' : 'Unassigned'
      });
    }

    const updateData = { ...req.body };

    if (req.body.status === 'completed' && task.status !== 'completed') {
      updateData.completedAt = new Date();
    } else if (req.body.status && req.body.status !== 'completed') {
      updateData.completedAt = null;
    }

    if (activityLog.length > 0) {
      updateData.$push = { activity: { $each: activityLog } };
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color')
      .populate('comments.user', 'name avatar')
      .populate('activity.user', 'name avatar');

    const io = req.app.get('io');
    if (io) {
      io.to(updated.project._id.toString()).emit('taskUpdate', {
        action: 'updated',
        task: updated
      });

      if (req.body.status === 'completed' && task.status !== 'completed' && updated.createdBy._id.toString() !== req.user._id.toString()) {
        io.to(updated.createdBy._id.toString()).emit('notification', {
          message: `Completed: ${updated.title}`,
          type: 'success',
          createdAt: new Date()
        });
      }
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Not found' });

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isCreator) {
      return res.status(403).json({ success: false, message: 'Denied' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Not found' });

    task.comments.push({ user: req.user._id, text });
    await task.save();
    await task.populate('comments.user', 'name avatar');

    const io = req.app.get('io');
    if (io) {
      io.to(task.project.toString()).emit('taskUpdate', {
        action: 'comment',
        taskId: task._id,
        comment: task.comments[task.comments.length - 1]
      });
    }

    res.status(201).json({ success: true, data: task.comments });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Not found' });

    const comment = task.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Not found' });

    const isAuthor = comment.user.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isAuthor) {
      return res.status(403).json({ success: false, message: 'Denied' });
    }

    comment.deleteOne();
    await task.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, addComment, deleteComment };
