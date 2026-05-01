import { Outlet, Navigate, Link } from 'react-router-dom';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative overflow-x-hidden">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sign In
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter details to proceed.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-2xl shadow-slate-200 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-800 animate-slide-up">
            <Outlet />
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500 pb-8">
        &copy; 2024 TaskFlow.
      </footer>
    </div>
  );
};

export default AuthLayout;
