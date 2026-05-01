import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/api';
import useAuthStore from '../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      const { user, token, message } = response.data;
      setAuth(user, token);
      toast.success(message || 'Welcome');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold dark:text-white">Sign In</h3>
        <p className="text-sm text-slate-500">Access your workspace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="email@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex justify-center items-center gap-2 py-3 shadow-lg shadow-primary-500/30"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
        Need an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500">
          Create one
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button 
          type="button"
          onClick={() => {
            setValue('email', 'admin@demo.com');
            setValue('password', '123456');
            handleSubmit(onSubmit)();
          }} 
          className="flex flex-col items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all group"
        >
          <span className="text-xs font-bold text-slate-400 group-hover:text-primary-500">ADMIN</span>
          <span className="text-[10px] text-slate-500">Demo Account</span>
        </button>
        <button 
          type="button"
          onClick={() => {
            setValue('email', 'user@demo.com');
            setValue('password', '123456');
            handleSubmit(onSubmit)();
          }} 
          className="flex flex-col items-center p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all group"
        >
          <span className="text-xs font-bold text-slate-400 group-hover:text-primary-500">USER</span>
          <span className="text-[10px] text-slate-500">Demo Account</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
