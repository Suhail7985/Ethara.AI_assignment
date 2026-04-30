const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, createProject, updateProject, deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { createProjectSchema, updateProjectSchema, validate } = require('../validators/projectValidator');

router.use(protect);

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', validate(createProjectSchema), createProject);
router.put('/:id', validate(updateProjectSchema), updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
