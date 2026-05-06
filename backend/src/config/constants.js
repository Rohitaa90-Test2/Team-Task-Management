/**
 * API Configuration and Constants
 */

const API_ROUTES = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    PROFILE: '/api/auth/profile'
  },
  PROJECTS: {
    LIST: '/api/projects',
    CREATE: '/api/projects',
    GET: '/api/projects/:projectId',
    UPDATE: '/api/projects/:projectId',
    DELETE: '/api/projects/:projectId',
    MEMBERS: {
      ADD: '/api/projects/:projectId/members',
      UPDATE_ROLE: '/api/projects/:projectId/members/:memberId',
      REMOVE: '/api/projects/:projectId/members/:memberId'
    }
  },
  TASKS: {
    LIST: '/api/tasks/project/:projectId',
    CREATE: '/api/tasks/project/:projectId',
    GET: '/api/tasks/:projectId/:taskId',
    UPDATE: '/api/tasks/:projectId/:taskId',
    DELETE: '/api/tasks/:projectId/:taskId',
    ASSIGN: '/api/tasks/:projectId/:taskId/assign',
    UPDATE_STATUS: '/api/tasks/:projectId/:taskId/status'
  },
  DASHBOARD: {
    USER: '/api/dashboard/user',
    PROJECT: '/api/dashboard/project/:projectId',
    STATISTICS: '/api/dashboard/project/:projectId/statistics'
  }
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500
};

const ROLES = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
};

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  PROJECT_NOT_FOUND: 'Project not found',
  TASK_NOT_FOUND: 'Task not found',
  NOT_AUTHORIZED: 'You are not authorized to perform this action',
  NOT_PROJECT_MEMBER: 'You are not a member of this project',
  ADMIN_REQUIRED: 'Admin access required',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid or malformed token'
};

module.exports = {
  API_ROUTES,
  HTTP_STATUS,
  ROLES,
  TASK_STATUS,
  ERROR_MESSAGES
};
