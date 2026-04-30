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
      {/* Professional Responsive Header */}
      <nav className="w-full px-6 py-6 sm:px-8 sm:py-8 flex items-center justify-between z-10">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-xs sm:text-sm rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:text-primary-600 dark:hover:text-primary-500 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to home</span>
          <span className="sm:hidden">Home</span>
        </Link>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
        </Link>

        <div className="w-20 sm:w-24 hidden xs:block"></div> {/* Spacer for balance */}
      </nav>

      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Please enter your details to continue
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-2xl shadow-slate-200 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-800 animate-slide-up">
            <Outlet />
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500 pb-8">
        &copy; 2024 TaskFlow SaaS. Built with passion for high-performance teams.
      </footer>
    </div>
  );
};

export default AuthLayout;
