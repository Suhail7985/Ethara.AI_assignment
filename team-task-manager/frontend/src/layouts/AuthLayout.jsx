import { Outlet, Navigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          TaskFlow
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Manage your team's tasks with precision.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-2xl shadow-slate-200 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-800 animate-slide-up">
          <Outlet />
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500">
        &copy; 2024 TaskFlow SaaS. Built with passion for high-performance teams.
      </footer>
    </div>
  );
};

export default AuthLayout;
