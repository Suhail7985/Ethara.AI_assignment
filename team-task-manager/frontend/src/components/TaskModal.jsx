import { useState, useEffect } from 'react';
import { 
  X, 
  Loader2, 
  MessageSquare, 
  Clock, 
  Send,
  Trash2,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, userService, taskService } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false, defaultProjectId = '' }) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('details');
  const [commentText, setCommentText] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects().then(res => res.data.data),
    enabled: isOpen,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers().then(res => res.data.data),
    enabled: isOpen,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        project: initialData.project?._id || initialData.project || '',
        assignedTo: initialData.assignedTo?._id || initialData.assignedTo || '',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        project: defaultProjectId,
        assignedTo: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [initialData, isOpen, defaultProjectId]);

  const addCommentMutation = useMutation({
    mutationFn: (text) => taskService.addComment(initialData._id, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', initialData._id]);
      setCommentText('');
      toast.success('Comment added');
    }
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => taskService.deleteComment(initialData._id, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', initialData._id]);
      toast.success('Comment deleted');
    }
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex-1">
            <h2 className="text-xl font-bold dark:text-white">
              {initialData ? 'Task Details' : 'Create New Task'}
            </h2>
            {initialData && (
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">
                Created by {initialData.createdBy?.name} • {formatDistanceToNow(new Date(initialData.createdAt))} ago
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        {initialData && (
          <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
            <button 
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'details' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Details
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'comments' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Comments
              <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                {initialData.comments?.length || 0}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'activity' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              History
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'details' ? (
            <form id="task-form" onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="input-field text-lg font-bold"
                      placeholder="e.g. Design Landing Page"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows="6"
                      className="input-field resize-none"
                      placeholder="Add a detailed description..."
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Clock className="w-3 h-3" /> Project
                    </label>
                    <select 
                      name="project" 
                      required 
                      className="input-field text-sm" 
                      value={formData.project} 
                      onChange={handleChange}
                    >
                      <option value="">
                        {projects ? 'Select Project' : 'Loading projects...'}
                      </option>
                      {projects?.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>
                  </div>                   <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <UserIcon className="w-3 h-3" /> Assignee
                    </label>
                    <select 
                      name="assignedTo" 
                      className="input-field text-sm" 
                      value={formData.assignedTo} 
                      onChange={handleChange}
                      disabled={currentUser?.role !== 'admin'}
                    >
                      <option value="">Unassigned</option>
                      {users?.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                    {currentUser?.role !== 'admin' && (
                      <p className="text-[10px] text-slate-400 mt-1">
                        Task assignments are managed strictly by Project Administrators.
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <CheckCircle2 className="w-3 h-3" /> Status
                      </label>
                      <select name="status" className="input-field text-sm" value={formData.status} onChange={handleChange}>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="review">In Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <AlertCircle className="w-3 h-3" /> Priority
                      </label>
                      <select name="priority" className="input-field text-sm" value={formData.priority} onChange={handleChange}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      <Calendar className="w-3 h-3" /> Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      className="input-field text-sm"
                      value={formData.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : activeTab === 'comments' ? (
            <div className="p-6 flex flex-col h-full animate-fade-in">
              <div className="flex-1 space-y-6">
                {initialData.comments?.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
                    No comments yet. Start the conversation!
                  </div>
                ) : (
                  initialData.comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                        {comment.user?.avatar ? (
                          <img src={comment.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          comment.user?.name?.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold dark:text-white">{comment.user?.name}</h4>
                          <span className="text-[10px] text-slate-400">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none relative group/item">
                          <p className="text-sm dark:text-slate-300 leading-relaxed">{comment.text}</p>
                          {(comment.user?._id === currentUser?._id || currentUser?.role === 'admin') && (
                            <button 
                              onClick={() => deleteCommentMutation.mutate(comment._id)}
                              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900">
                <form onSubmit={handleAddComment} className="relative">
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="input-field pr-12"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button 
                    disabled={addCommentMutation.isPending || !commentText.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {addCommentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6 animate-fade-in">
              {initialData.activity?.length === 0 ? (
                <div className="text-center py-12 text-slate-400 italic">No history available for this task.</div>
              ) : (
                <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-8 space-y-8">
                  {[...initialData.activity].reverse().map((act, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-primary-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                          {act.user?.avatar ? (
                            <img src={act.user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            act.user?.name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-sm dark:text-slate-300">
                            <span className="font-bold">{act.user?.name}</span> 
                            {' '}
                            <span className="text-slate-500">
                              {act.action === 'created' ? 'created the task' : 
                               act.action === 'status_change' ? act.details : 
                               act.action === 'assignment' ? act.details : 
                               act.action}
                            </span>
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {formatDistanceToNow(new Date(act.createdAt))} ago
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-all border border-slate-200 dark:border-slate-800 hover:bg-slate-50"
          >
            Cancel
          </button>
          {activeTab === 'details' && (
            <button
              type="submit"
              form="task-form"
              disabled={isLoading}
              className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 shadow-lg shadow-primary-500/30"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? 'Update Task' : 'Create Task'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
