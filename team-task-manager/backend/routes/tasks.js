const express = require('express');
const router = express.Router();
const {
  getTasks, getTask, createTask, updateTask, deleteTask, addComment, deleteComment,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { createTaskSchema, updateTaskSchema, addCommentSchema, validate } = require('../validators/taskValidator');

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

// Comments
router.post('/:id/comments', validate(addCommentSchema), addComment);
router.delete('/:id/comments/:commentId', deleteComment);

module.exports = router;
