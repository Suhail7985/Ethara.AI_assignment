import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  Plus, 
  MoreVertical, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  Loader2,
  Filter,
  Search
} from 'lucide-react';
import { taskService, projectService } from '../services/api';
import { toast } from 'react-hot-toast';

const Kanban = () => {
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState('');
  
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects().then(res => res.data.data),
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', { project: projectId }],
    queryFn: () => taskService.getTasks({ project: projectId }).then(res => res.data.data),
    enabled: true,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.updateTask(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task status updated');
    },
  });

  const columns = {
    'todo': { id: 'todo', title: 'To Do', tasks: [] },
    'in-progress': { id: 'in-progress', title: 'In Progress', tasks: [] },
    'review': { id: 'review', title: 'In Review', tasks: [] },
    'completed': { id: 'completed', title: 'Completed', tasks: [] },
  };

  if (tasks) {
    tasks.forEach(task => {
      if (columns[task.status]) {
        columns[task.status].tasks.push(task);
      }
    });
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    updateTaskMutation.mutate({ id: draggableId, status: destination.droppableId });
  };

  const PriorityBadge = ({ priority }) => {
    const colors = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${colors[priority]}`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Kanban Board</h1>
          <p className="text-slate-500 text-sm mt-1">Visualize and manage your project workflow.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)}
            className="input-field py-1.5 min-w-[200px] text-sm"
          >
            <option value="">All Projects</option>
            {projects?.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-6 h-full min-h-[500px]">
              {Object.values(columns).map((column) => (
                <div key={column.id} className="kanban-column w-80 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-700 dark:text-slate-300">{column.title}</h3>
                      <span className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-700">
                        {column.tasks.length}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
                      <Plus className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 space-y-3"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all active:scale-105 active:rotate-2 group"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <PriorityBadge priority={task.priority} />
                                  <button className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                                <h4 className="font-semibold text-sm mb-2 dark:text-white line-clamp-2">
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                                    {task.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center justify-between mt-auto">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                      <MessageSquare className="w-3 h-3" />
                                      {task.comments?.length || 0}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                      <Paperclip className="w-3 h-3" />
                                      {task.attachments?.length || 0}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {task.dueDate && (
                                      <div className={`flex items-center gap-1 text-[10px] font-bold ${new Date(task.dueDate) < new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                                        <Calendar className="w-3 h-3" />
                                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                      </div>
                                    )}
                                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">
                                      {task.assignedTo?.name?.charAt(0) || '?'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default Kanban;
