const express = require('express');
const {
  createProject,
  getProjectById,
  getUserProjects,
  updateProject,
  deleteProject,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember
} = require('../controllers/projectController');
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  checkProjectMembership,
  checkAdminRole,
  checkProjectOwner
} = require('../middleware/authorizationMiddleware');
const { validate, projectValidation, memberValidation } = require('../middleware/validation');

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

// Get user's projects
router.get('/', getUserProjects);

// Create project
router.post('/', validate(projectValidation.create), createProject);

// Get project by ID
router.get('/:projectId', checkProjectMembership, getProjectById);

// Update project (owner only)
router.put('/:projectId', checkProjectOwner, validate(projectValidation.update), updateProject);

// Delete project (owner only)
router.delete('/:projectId', checkProjectOwner, deleteProject);

// Project members management
// Add member (admin only)
router.post(
  '/:projectId/members',
  checkProjectMembership,
  checkAdminRole,
  validate(memberValidation.add),
  addProjectMember
);

// Update member role (admin only)
router.put(
  '/:projectId/members/:memberId',
  checkProjectMembership,
  checkAdminRole,
  validate(memberValidation.updateRole),
  updateProjectMemberRole
);

// Remove member (admin only)
router.delete(
  '/:projectId/members/:memberId',
  checkProjectMembership,
  checkAdminRole,
  removeProjectMember
);

module.exports = router;
