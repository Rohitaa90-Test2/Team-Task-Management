import api from './client';

export const authAPI = {
  signup: (email, password, name) => 
    api.post('/api/auth/signup', { email, password, name }),
  login: (email, password) => 
    api.post('/api/auth/login', { email, password }),
  getProfile: () => 
    api.get('/api/auth/profile')
};

export const projectAPI = {
  getAll: () => 
    api.get('/api/projects'),
  getById: (id) => 
    api.get(`/api/projects/${id}`),
  create: (name, description) => 
    api.post('/api/projects', { name, description }),
  update: (id, name, description) => 
    api.put(`/api/projects/${id}`, { name, description }),
  delete: (id) => 
    api.delete(`/api/projects/${id}`),
  addMember: (projectId, email, role) => 
    api.post(`/api/projects/${projectId}/members`, { email, role }),
  updateMemberRole: (projectId, memberId, role) => 
    api.put(`/api/projects/${projectId}/members/${memberId}`, { role }),
  removeMember: (projectId, memberId) => 
    api.delete(`/api/projects/${projectId}/members/${memberId}`)
};

export const taskAPI = {
  getAll: (projectId) => 
    api.get(`/api/tasks/project/${projectId}`),
  getById: (projectId, taskId) => 
    api.get(`/api/tasks/${projectId}/${taskId}`),
  create: (projectId, data) => 
    api.post(`/api/tasks/project/${projectId}`, data),
  update: (projectId, taskId, data) => 
    api.put(`/api/tasks/${projectId}/${taskId}`, data),
  delete: (projectId, taskId) => 
    api.delete(`/api/tasks/${projectId}/${taskId}`),
  assign: (projectId, taskId, assignedToId) => 
    api.patch(`/api/tasks/${projectId}/${taskId}/assign`, { assignedToId }),
  updateStatus: (projectId, taskId, status) => 
    api.patch(`/api/tasks/${projectId}/${taskId}/status`, { status })
};

export const dashboardAPI = {
  getUserDashboard: () => 
    api.get('/api/dashboard/user'),
  getProjectDashboard: (projectId) => 
    api.get(`/api/dashboard/project/${projectId}`),
  getProjectStatistics: (projectId) => 
    api.get(`/api/dashboard/project/${projectId}/statistics`)
};
