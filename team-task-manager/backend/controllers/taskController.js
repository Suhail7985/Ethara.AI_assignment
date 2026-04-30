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

    // If not admin, only show tasks from accessible projects OR tasks assigned to me
    if (req.user.role !== 'admin') {
      const accessibleProjects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      }).select('_id');
      const projectIds = accessibleProjects.map((p) => p._id);

      if (project) {
        // If searching specific project, it must be accessible
        if (!projectIds.map(String).includes(String(project))) {
          query.assignedTo = req.user._id; // Fallback to only seeing my tasks in that project if not a member
        }
      } else {
        // Broad search: see all tasks in accessible projects + any tasks assigned to me
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
    if (req.body.assignedTo === '') delete req.body.assignedTo;
    const { title, description, project, assignedTo, status, priority, dueDate, tags, order } = req.body;

    const access = await checkProjectAccess(project, req.user);
    if (access.error) return res.status(access.status).json({ success: false, message: access.error });

    const task = await Task.create({
      title, description, project, assignedTo, status, priority, dueDate, tags, order,
      createdBy: req.user._id,
      activity: [{
        user: req.user._id,
        action: 'created',
        details: 'Initial task creation'
      }]
    });

    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name color');

    // Notify assigned user
    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await User.findByIdAndUpdate(assignedTo, {
        $push: {
          notifications: {
            message: `${req.user.name} assigned you a task: "${title}"`,
            type: 'info',
          },
        },
      });
      
      const io = req.app.get('io');
      if (io) {
        io.to(assignedTo).emit('notification', {
          message: `${req.user.name} assigned you a task: "${title}"`,
          type: 'info',
          createdAt: new Date()
        });
      }
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
    if (req.body.assignedTo === '') req.body.assignedTo = null;
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

    // Role-based Assignment check: Members cannot assign tasks to others
    if (req.user.role !== 'admin' && req.body.assignedTo && req.body.assignedTo !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Members can only assign tasks to themselves.' });
    }

    // Prepare activity logs
    const activityLog = [];
    if (req.body.status && req.body.status !== task.status) {
      activityLog.push({
        user: req.user._id,
        action: 'status_change',
        details: `Moved from ${task.status} to ${req.body.status}`
      });
    }
    if (req.body.assignedTo !== undefined && String(req.body.assignedTo) !== String(task.assignedTo)) {
      activityLog.push({
        user: req.user._id,
        action: 'assignment',
        details: req.body.assignedTo ? 'Reassigned task' : 'Unassigned task'
      });
    }

    const updateData = { ...req.body };
    
    // Handle status change for completedAt
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
      // Notify the project room about the update
      io.to(updated.project._id.toString()).emit('taskUpdate', {
        action: 'updated',
        task: updated
      });

      // If status changed to completed, notify the creator
      if (req.body.status === 'completed' && task.status !== 'completed' && updated.createdBy._id.toString() !== req.user._id.toString()) {
        io.to(updated.createdBy._id.toString()).emit('notification', {
          message: `${req.user.name} completed task: "${updated.title}"`,
          type: 'success',
          createdAt: new Date()
        });
      }
    }

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

    const io = req.app.get('io');
    if (io) {
      io.to(task.project.toString()).emit('taskUpdate', {
        action: 'comment',
        taskId: task._id,
        comment: task.comments[task.comments.length - 1]
      });
    }

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
