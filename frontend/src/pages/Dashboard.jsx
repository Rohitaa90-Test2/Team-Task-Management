import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { dashboardAPI, projectAPI } from '../api/services';
import { BarChart3, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { showError } from '../utils/toast';
import { Loader } from '../components/Loader';

export const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, projRes] = await Promise.all([
        dashboardAPI.getUserDashboard(),
        projectAPI.getAll()
      ]);
      setDashboard(dashRes.data.dashboard);
      setProjects(projRes.data.projects);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<BarChart3 className="text-blue-600" size={32} />}
              title="Total Tasks"
              value={dashboard?.totalAssignedTasks || 0}
              color="bg-blue-50"
            />
            <StatCard
              icon={<CheckCircle2 className="text-green-600" size={32} />}
              title="Completed"
              value={dashboard?.assignedTasksByStatus?.find(s => s.status === 'DONE')?.count || 0}
              color="bg-green-50"
            />
            <StatCard
              icon={<Clock className="text-yellow-600" size={32} />}
              title="In Progress"
              value={dashboard?.assignedTasksByStatus?.find(s => s.status === 'IN_PROGRESS')?.count || 0}
              color="bg-yellow-50"
            />
            <StatCard
              icon={<AlertCircle className="text-red-600" size={32} />}
              title="Overdue"
              value={dashboard?.overdueTasksCount || 0}
              color="bg-red-50"
            />
          </div>

          {/* Projects Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Projects</h2>
            {projects.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No projects yet. Create one to get started!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{project.description || 'No description'}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{project.members?.length || 0} members</span>
                      <span className="text-gray-600">{project._count?.tasks || 0} tasks</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Tasks */}
          {dashboard?.overdueTasks?.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Overdue Tasks</h2>
              <div className="space-y-4">
                {dashboard.overdueTasks.map((task) => (
                  <div key={task.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`${color} rounded-lg p-6 shadow`}>
    <div className="flex items-center gap-4">
      <div>{icon}</div>
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);
