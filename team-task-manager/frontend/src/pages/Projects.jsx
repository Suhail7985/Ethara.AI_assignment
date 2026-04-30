import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Clock, 
  Users, 
  ChevronRight,
  FolderOpen,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react';
import { projectService } from '../services/api';
import { toast } from 'react-hot-toast';

const Projects = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', searchTerm],
    queryFn: () => projectService.getProjects({ search: searchTerm }).then(res => res.data.data),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project deleted');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) {
      deleteProjectMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track all your active team initiatives.</p>
        </div>
        
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
          <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-lg">Grid</button>
          <button className="px-3 py-1.5 text-xs font-semibold text-slate-500">List</button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <div key={project._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group border-t-4" style={{ borderTopColor: project.color }}>
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <FolderOpen className="w-5 h-5" style={{ color: project.color }} />
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-slate-400 hover:text-primary-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold dark:text-white mb-2 group-hover:text-primary-600 transition-colors cursor-pointer">
                {project.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-6">
                {project.description || 'No description provided for this project.'}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Progress</span>
                  <span className="font-bold dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 transition-all duration-500" 
                    style={{ width: `${project.progress}%`, backgroundColor: project.color }}
                  ></div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((member, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">
                        {member.name?.charAt(0)}
                      </div>
                    ))}
                    {project.members?.length > 3 && (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock className="w-3 h-3" />
                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!projects || projects.length === 0) && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold dark:text-white">No projects yet</h3>
              <p className="text-slate-500 text-sm mt-1">Create your first project to start managing tasks.</p>
              <button className="btn-primary mt-6">Create New Project</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
