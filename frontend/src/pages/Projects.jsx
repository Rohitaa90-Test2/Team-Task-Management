import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { ProjectCard } from '../components/ProjectCard';
import { projectAPI } from '../api/services';
import { Plus } from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader';

const SectionHeader = ({ title, count }) => (
  <div className="flex items-center gap-3 mb-4">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-2.5 py-0.5 rounded-full">{count}</span>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 text-sm">{message}</div>
);

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { user } = useAuth();

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data.projects);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectAPI.create(formData.name, formData.description);
      showSuccess('Project created successfully!');
      setFormData({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        showSuccess('Project deleted successfully!');
        fetchProjects();
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const isAdmin = (project) =>
    project.members?.some(m => m.user?.id === user?.id && m.role === 'ADMIN');

  const myProjects = projects.filter(isAdmin);
  const assignedProjects = projects.filter(p => !isAdmin(p));

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">

          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Projects</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              <Plus size={20} /> New Project
            </button>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
                    Create
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* My Projects */}
          <div className="mb-10">
            <SectionHeader title="My Projects" count={myProjects.length} />
            {myProjects.length === 0 ? (
              <EmptyState message="You haven't created any projects yet. Click 'New Project' to get started!" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProjects.map(project => (
                  <ProjectCard key={project.id} project={project} isAdmin={true} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-gray-300 mb-10" />

          {/* Assigned Projects */}
          <div>
            <SectionHeader title="Assigned Projects" count={assignedProjects.length} />
            {assignedProjects.length === 0 ? (
              <EmptyState message="You haven't been assigned to any projects yet." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} isAdmin={false} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
