import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { taskService } from '../services/api';

const Tasks = () => {
  const [filterStatus, setFilterStatus] = useState('');
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', { status: filterStatus }],
    queryFn: () => taskService.getTasks({ status: filterStatus }).then(res => res.data.data),
  });

  const getStatusStyle = (status) => {
    const styles = {
      'todo': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      'in-progress': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
      'review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return styles[status] || styles['todo'];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage all your assigned tasks.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilterStatus('')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === '' ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('todo')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === 'todo' ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              Todo
            </button>
            <button 
              onClick={() => setFilterStatus('in-progress')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === 'in-progress' ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterStatus === 'completed' ? 'bg-primary-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'}`}
            >
              Completed
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Filter tasks..." className="input-field py-1.5 pl-10 text-sm w-full sm:w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Assigned</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="7" className="px-6 py-4 h-12 bg-slate-50/30 dark:bg-slate-800/20"></td>
                  </tr>
                ))
              ) : tasks?.map((task) => (
                <tr key={task._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-primary-500'}`}></div>
                      <span className={`text-sm font-semibold dark:text-white ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      {task.project?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg ${getStatusStyle(task.status)}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold uppercase ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 border border-primary-200">
                      {task.assignedTo?.name?.charAt(0) || '?'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {(!tasks || tasks.length === 0) && !isLoading && (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-slate-400 text-sm">
                    No tasks found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
