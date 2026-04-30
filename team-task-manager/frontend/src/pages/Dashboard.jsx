import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { userService } from '../services/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => userService.getAnalytics().then(res => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const statusColors = {
    'todo': '#94a3b8',
    'in-progress': '#38bdf8',
    'review': '#f59e0b',
    'completed': '#10b981',
  };

  const pieData = analytics?.taskStatusBreakdown?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: statusColors[item._id] || '#6366f1'
  })) || [];

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-1 dark:text-white">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Workspace Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-sm font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            {format(new Date(), 'MMMM dd, yyyy')}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Projects" 
          value={analytics?.totalProjects || 0} 
          icon={Layers} 
          color="primary"
          trend="+2 from last month"
        />
        <StatCard 
          title="Total Tasks" 
          value={analytics?.totalTasks || 0} 
          icon={CheckCircle2} 
          color="indigo"
        />
        <StatCard 
          title="Pending" 
          value={analytics?.todo + analytics?.inProgress + analytics?.review || 0} 
          icon={Clock} 
          color="amber"
        />
        <StatCard 
          title="Overdue" 
          value={analytics?.overdue || 0} 
          icon={AlertCircle} 
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg dark:text-white">Weekly Performance</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {analytics?.productivity}% Efficiency
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Mon', tasks: 12 },
                { name: 'Tue', tasks: 19 },
                { name: 'Wed', tasks: 15 },
                { name: 'Thu', tasks: 22 },
                { name: 'Fri', tasks: 18 },
                { name: 'Sat', tasks: 8 },
                { name: 'Sun', tasks: 5 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Task Status</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold dark:text-white">{analytics?.totalTasks}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Tasks</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-bold dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Recent Tasks</h3>
          <div className="space-y-4">
            {analytics?.recentTasks?.map((task) => (
              <div key={task._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-8 rounded-full`} style={{ backgroundColor: statusColors[task.status] }}></div>
                  <div>
                    <p className="text-sm font-semibold dark:text-white">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.project?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {(!analytics?.recentTasks || analytics.recentTasks.length === 0) && (
              <div className="text-center py-10">
                <p className="text-slate-400 text-sm italic">No recent tasks found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-lg mb-6 dark:text-white">Productivity Streak</h3>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * analytics?.productivity) / 100}
                  strokeLinecap="round"
                  className="text-primary-600"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold dark:text-white">{analytics?.productivity}%</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Efficiency</span>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 max-w-[250px]">
              You've completed <span className="font-bold text-primary-600">{analytics?.completed}</span> tasks this week. Keep the momentum going!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
