import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { projectAPI, taskAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, CheckCircle2, Clock, AlertCircle, Users } from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';

export const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    status: 'TODO',
    dueDate: '',
    assignedToId: null
  });
  const [memberForm, setMemberForm] = useState({
    email: '',
    role: 'MEMBER'
  });

  useEffect(() => {
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes] = await Promise.all([
        projectAPI.getById(id),
        taskAPI.getAll(id)
      ]);
      setProject(projRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = project?.members?.find(m => m.userId === user?.id)?.role === 'ADMIN';

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskAPI.create(id, taskForm);
      setTaskForm({ title: '', description: '', status: 'TODO', dueDate: '', assignedToId: null });
      setShowTaskForm(false);
      showSuccess('Task created successfully!');
      fetchProjectAndTasks();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm('Delete this task?')) {
      try {
        await taskAPI.delete(id, taskId);        showSuccess('Task deleted successfully!');        fetchProjectAndTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.updateStatus(id, taskId, newStatus);      showSuccess('Task status updated!');      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.addMember(id, memberForm.email, memberForm.role);
      setMemberForm({ email: '', role: 'MEMBER' });
      setShowAddMemberForm(false);
      showSuccess('Member added successfully!');
      fetchProjectAndTasks();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (confirm('Remove this member from the project?')) {
      try {
        await projectAPI.removeMember(id, memberId);        showSuccess('Member removed successfully!');        fetchProjectAndTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  const handleUpdateMemberRole = async (memberId, newRole) => {
    try {
      await projectAPI.updateMemberRole(id, memberId, newRole);      showSuccess('Member role updated!');      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member role');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-blue-600 hover:text-blue-700 mb-6"
          >
            ← Back to Projects
          </button>

          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{project?.name}</h1>
            <p className="text-gray-600 text-lg mb-6">{project?.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-600 text-sm">Members</p>
                <p className="text-2xl font-bold text-gray-800">{project?.members?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{tasks.length}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'DONE').length}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === 'tasks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 font-semibold transition flex items-center gap-2 ${
                activeTab === 'members'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users size={20} /> Members
            </button>
          </div>

          {/* Tasks Section */}
          {activeTab === 'tasks' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  <Plus size={20} /> New Task
                </button>
              )}
            </div>

            {showTaskForm && isAdmin && (
              <form onSubmit={handleTaskSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Task Title</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Due Date</label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Status</label>
                    <select
                      value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Assign To</label>
                    <select
                      value={taskForm.assignedToId || ''}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value ? parseInt(e.target.value) : null })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Unassigned</option>
                      {project?.members?.map((member) => (
                        <option key={member.id} value={member.userId}>
                          {member.user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Create Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {tasks.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No tasks yet.</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isAdmin={isAdmin}
                    onStatusChange={(status) => handleStatusChange(task.id, status)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
          )}

          {/* Members Section */}
          {activeTab === 'members' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Members</h2>
              {isAdmin && (
                <button
                  onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  <Plus size={20} /> Add Member
                </button>
              )}
            </div>

            {showAddMemberForm && isAdmin && (
              <form onSubmit={handleAddMember} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Member Email</label>
                  <input
                    type="email"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Role</label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMemberForm(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {project?.members?.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No members yet.</p>
            ) : (
              <div className="space-y-4">
                {project?.members?.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    isAdmin={isAdmin}
                    currentUserId={user?.id}
                    onRemove={() => handleRemoveMember(member.id)}
                    onUpdateRole={(newRole) => handleUpdateMemberRole(member.id, newRole)}
                  />
                ))}
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </>
  );
};

const MemberCard = ({ member, isAdmin, currentUserId, onRemove, onUpdateRole }) => {
  return (
    <div className="border border-gray-300 p-4 rounded-lg flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{member.user.name}</h3>
        <p className="text-gray-600 text-sm">{member.user.email}</p>
      </div>

      <div className="flex gap-2 items-center">
        {isAdmin && member.userId !== currentUserId ? (
          <>
            <select
              value={member.role}
              onChange={(e) => onUpdateRole(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              onClick={onRemove}
              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
            >
              <Trash2 size={18} />
            </button>
          </>
        ) : (
          <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium">
            {member.role}
          </span>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, isAdmin, onStatusChange, onDelete }) => {
  const statusIcons = {
    TODO: <AlertCircle className="text-red-600" size={20} />,
    IN_PROGRESS: <Clock className="text-yellow-600" size={20} />,
    DONE: <CheckCircle2 className="text-green-600" size={20} />
  };

  const statusColors = {
    TODO: 'bg-red-100 border-red-300',
    IN_PROGRESS: 'bg-yellow-100 border-yellow-300',
    DONE: 'bg-green-100 border-green-300'
  };

  return (
    <div className={`border-l-4 p-4 rounded ${statusColors[task.status]}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {statusIcons[task.status]}
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          </div>
          <p className="text-gray-600 mb-2">{task.description}</p>
          <div className="flex gap-4 text-sm text-gray-600">
            {task.dueDate && (
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            )}
            {task.assignedTo && (
              <span>Assigned to: {task.assignedTo.name}</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {isAdmin && (
            <>
              <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
              <button
                onClick={onDelete}
                className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
