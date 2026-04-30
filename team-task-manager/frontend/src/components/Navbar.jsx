import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  Moon, 
  Sun,
  Plus
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = ({ onOpenSidebar }) => {
  const { user } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenSidebar}
            className="p-2 lg:hidden text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus-within:border-primary-500 rounded-xl transition-all w-64 lg:w-96">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks, projects..." 
              className="bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-primary-500/20 active:scale-95">
            <Plus className="w-4 h-4" />
            New Task
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

          <button 
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 ml-2 overflow-hidden cursor-pointer border border-slate-300 dark:border-slate-600">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
