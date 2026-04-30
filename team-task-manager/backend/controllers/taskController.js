const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// Helper: check project access
const checkProjectAccess = async (projectId, user) => {
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found.', status: 404 };
  const isOwner = project.owner.toString() === user._id.toString();
  const isMember = project.members.map(String).includes(user._id.toString());
  if (user.role !== 'admin' && !isOwner && !isMember) {
    return { error: 'Access denied.', status: 403 };
  }
  return { project };
};

// @desc    Get tasks (with filters)
// @route   GET /api/tasks
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

    // If not admin, only show tasks from accessible projects
    if (req.user.role !== 'admin') {
      const accessibleProjects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      }).select('_id');
      const ids = accessibleProjects.map((p) => p._id);
      if (!project) query.project = { $in: ids };
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

// @desc    Get single task
// @route   GET /api/tasks/:id
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color owner members')
      .populate('comments.user', 'name avatar');

    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Create task
// @route   POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate, tags, order } = req.body;

    const access = await checkProjectAccess(project, req.user);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    const task = await Task.create({
      title, description, project, assignedTo, status, priority, dueDate, tags, order,
      createdBy: req.user._id,
    });

    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name color');

    // Notify assigned user
    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: {
          notifications: {
            message: `You've been assigned task "${title}"`,
            type: 'info',
          },
        },
      });
    }

    res.status(201).json({ success: true, message: 'Task created.', data: task });
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    // Members can only update tasks assigned to them; admins and project owners can update all
    const isAssigned = task.assignedTo?.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isAssigned && !isCreator) {
      // Check project ownership
      const project = await Project.findById(task.project);
      const isProjectOwner = project?.owner.toString() === req.user._id.toString();
      if (!isProjectOwner) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this task.' });
      }
    }

    // Handle status change for completedAt
    if (req.body.status === 'completed' && task.status !== 'completed') {
      req.body.completedAt = new Date();
    } else if (req.body.status && req.body.status !== 'completed') {
      req.body.completedAt = null;
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color')
      .populate('comments.user', 'name avatar');

    res.json({ success: true, message: 'Task updated.', data: updated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isCreator) {
      return res.status(403).json({ success: false, message: 'Only task creator or admin can delete.' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    task.comments.push({ user: req.user._id, text });
    await task.save();
    await task.populate('comments.user', 'name avatar');

    res.status(201).json({ success: true, message: 'Comment added.', data: task.comments });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete comment
// @route   DELETE /api/tasks/:id/comments/:commentId
const deleteComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const comment = task.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });

    const isAuthor = comment.user.toString() === req.user._id.toString();
    if (req.user.role !== 'admin' && !isAuthor) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    comment.deleteOne();
    await task.save();
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, addComment, deleteComment };
