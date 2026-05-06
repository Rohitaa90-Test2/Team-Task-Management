import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Users } from 'lucide-react';

export const ProjectCard = ({ project, isAdmin, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 min-w-0 mr-2">
            <h2 className="text-xl font-bold text-gray-800 truncate">{project.name}</h2>
            {!isAdmin && (
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Member</span>
            )}
            {isAdmin && (
              <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Admin</span>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="relative group">
              <button
                onClick={() => isAdmin && navigate(`/projects/${project.id}`)}
                disabled={!isAdmin}
                className={`p-2 rounded transition ${isAdmin ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <Edit2 size={18} />
              </button>
              {!isAdmin && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 text-center text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                  Only admin can perform this action
                </span>
              )}
            </div>
            <div className="relative group">
              <button
                onClick={() => isAdmin && onDelete(project.id)}
                disabled={!isAdmin}
                className={`p-2 rounded transition ${isAdmin ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <Trash2 size={18} />
              </button>
              {!isAdmin && (
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 text-center text-xs bg-gray-800 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                  Only admin can perform this action
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-4">{project.description || 'No description'}</p>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{project.members?.length || 0} members</span>
          </div>
          <span>{project._count?.tasks || 0} tasks</span>
        </div>
        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
