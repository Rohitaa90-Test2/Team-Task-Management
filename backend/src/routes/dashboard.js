const express = require('express');
const {
  getProjectDashboard,
  getUserDashboard,
  getProjectStatistics
} = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkProjectMembership } = require('../middleware/authorizationMiddleware');

const router = express.Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// User's personal dashboard
router.get('/user', getUserDashboard);

// Project dashboard
router.get('/project/:projectId', checkProjectMembership, getProjectDashboard);

// Project statistics
router.get('/project/:projectId/statistics', checkProjectMembership, getProjectStatistics);

module.exports = router;
