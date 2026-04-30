import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-black text-primary-600/20 dark:text-primary-500/10">404</h1>
        <div className="relative -mt-16 sm:-mt-24">
          <h2 className="text-3xl sm:text-4xl font-bold dark:text-white">Page Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a new URL.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
    </div>
  );
};

export default NotFound;
