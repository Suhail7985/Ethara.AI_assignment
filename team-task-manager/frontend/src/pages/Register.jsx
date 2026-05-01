import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Loader2, Shield } from 'lucide-react';
import { authService } from '../services/api';
import useAuthStore from '../store/useAuthStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  role: z.enum(['admin', 'member']).default('member'),
});

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'member' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      const { user, token, message } = response.data;
      setAuth(user, token);
      toast.success(message || 'Account created');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold dark:text-white">Register</h3>
        <p className="text-sm text-slate-500">Join your team workspace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              {...register('name')}
              type="text"
              className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

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
              type="password"
              className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue('role', 'member')}
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl transition-all ${
                selectedRole === 'member' 
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'bg-white text-slate-600'
              }`}
            >
              <User className="w-4 h-4" />
              Member
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'admin')}
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-xl transition-all ${
                selectedRole === 'admin' 
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'bg-white text-slate-600'
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex justify-center items-center gap-2 py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
