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
import ProjectModal from '../components/ProjectModal';
import useAuthStore from '../store/useAuthStore';

const Projects = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', searchTerm],
    queryFn: () => projectService.getProjects({ search: searchTerm }).then(res => res.data.data),
  });

  const createProjectMutation = useMutation({
    mutationFn: (data) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project created successfully');
      setIsModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }) => projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project updated successfully');
      setIsModalOpen(false);
      setSelectedProject(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update project');
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (id) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Project deleted');
    },
  });

  const handleCreate = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (selectedProject) {
      updateProjectMutation.mutate({ id: selectedProject._id, data });
    } else {
      createProjectMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) {
      deleteProjectMutation.mutate(id);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track all your active team initiatives.</p>
        </div>
        
        {isAdmin && (
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Project
          </button>
        )}
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
          <button 
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-primary-600' : 'text-slate-500'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-primary-600' : 'text-slate-500'}`}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {[1, 2, 3].map(i => (
            <div key={i} className={`${viewMode === 'grid' ? 'h-48' : 'h-20'} bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse`}></div>
          ))}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"}>
          {viewMode === 'grid' ? (
            projects?.map((project) => (
              <div key={project._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all group border-t-4" style={{ borderTopColor: project.color }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <FolderOpen className="w-5 h-5" style={{ color: project.color }} />
                  </div>
                  {(isAdmin || project.owner?._id === user?._id || project.owner === user?._id) && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEdit(project)}
                        className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
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
                        <div key={i} title={member.name} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold">
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
            ))
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Team</th>
                    <th className="px-6 py-4">Deadline</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {projects?.map((project) => (
                    <tr key={project._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                            <FolderOpen className="w-4 h-4" style={{ color: project.color }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold dark:text-white">{project.name}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {project.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 w-48">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full transition-all" style={{ width: `${project.progress}%`, backgroundColor: project.color }}></div>
                          </div>
                          <span className="text-[10px] font-bold dark:text-white">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-1.5">
                          {project.members?.slice(0, 3).map((member, i) => (
                            <div key={i} title={member.name} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-bold">
                              {member.name?.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-medium text-slate-500">
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(isAdmin || project.owner?._id === user?._id || project.owner === user?._id) && (
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(project)} className="p-1 text-slate-400 hover:text-primary-600"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(project._id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(!projects || projects.length === 0) && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold dark:text-white">No projects yet</h3>
              <p className="text-slate-500 text-sm mt-1">Create your first project to start managing tasks.</p>
              <button onClick={handleCreate} className="btn-primary mt-6">Create New Project</button>
            </div>
          )}
        </div>
      )}

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedProject}
        isLoading={createProjectMutation.isPending || updateProjectMutation.isPending}
      />
    </div>
  );
};

export default Projects;
