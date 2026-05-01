import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import socketService from '../services/socket';
import useAuthStore from '../store/useAuthStore';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const MainLayout = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?._id) {
      socketService.connect(user._id);

      socketService.on('notification', (data) => {
        toast.success(data.message, {
          icon: '🔔',
          duration: 5000,
        });
        queryClient.invalidateQueries(['notifications']);
      });
    }

    return () => {
      socketService.disconnect();
    };
  }, [user?._id, queryClient]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-50">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
