const express = require('express');
const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus
} = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkProjectMembership } = require('../middleware/authorizationMiddleware');
const { validate, taskValidation } = require('../middleware/validation');

const router = express.Router();

// All task routes require authentication
router.use(authMiddleware);

// Get project tasks
router.get('/project/:projectId', checkProjectMembership, getProjectTasks);

// Create task
router.post(
  '/project/:projectId',
  checkProjectMembership,
  validate(taskValidation.create),
  createTask
);

// Get task by ID
router.get('/:projectId/:taskId', checkProjectMembership, getTaskById);

// Update task
router.put(
  '/:projectId/:taskId',
  checkProjectMembership,
  validate(taskValidation.update),
  updateTask
);

// Delete task
router.delete('/:projectId/:taskId', checkProjectMembership, deleteTask);

// Assign task
router.patch('/:projectId/:taskId/assign', checkProjectMembership, assignTask);

// Update task status
router.patch('/:projectId/:taskId/status', checkProjectMembership, updateTaskStatus);

module.exports = router;
