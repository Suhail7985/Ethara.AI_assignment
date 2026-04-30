import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from './store/useAuthStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import Team from './pages/Team';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* App Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/team" element={<AdminRoute><Team /></AdminRoute>} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
