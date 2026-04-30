import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  UserPlus, 
  Search, 
  Mail, 
  Shield, 
  User, 
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import { userService } from '../services/api';
import { toast } from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

const UserModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'member',
    isActive: true
  });

  useState(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        role: initialData.role || 'member',
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold dark:text-white">Edit Team Member</h3>
            <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="input-field" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
              <select 
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-4 h-4 text-primary-600 rounded border-slate-300"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Account</label>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
              <button type="submit" disabled={isLoading} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');

  const { data: team, isLoading } = useQuery({
    queryKey: ['team', searchTerm],
    queryFn: () => userService.getUsers({ search: searchTerm }).then(res => res.data.data),
  });

  const inviteMutation = useMutation({
    mutationFn: (data) => userService.inviteUser(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['team']);
      toast.success(res.data.message || 'Invitation sent');
      setIsInviteModalOpen(false);
      setInviteEmail('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send invitation');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      toast.success('User updated');
      setSelectedUser(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  });

  const handleInvite = (e) => {
    e.preventDefault();
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  const handleDeactivate = (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      updateMutation.mutate({ id, isActive: false });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Team Members</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your organization's members and their access levels.</p>
        </div>
        
        {currentUser?.role === 'admin' && (
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="input-field pl-10 bg-slate-50 dark:bg-slate-800 border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))
        ) : team?.map((member) => (
          <div key={member._id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xl border border-primary-200 dark:border-primary-800">
                  {member.name?.charAt(0)}
                </div>
                {member.isActive && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              {currentUser?.role === 'admin' && member._id !== currentUser._id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setSelectedUser(member)} className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeactivate(member._id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-bold dark:text-white">{member.name} {member._id === currentUser?._id && '(You)'}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 truncate">{member.email}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800">
                {member.role === 'admin' ? (
                  <Shield className="w-3 h-3 text-primary-600" />
                ) : (
                  <User className="w-3 h-3 text-slate-400" />
                )}
                <span className={`text-[10px] font-bold uppercase tracking-wider ${member.role === 'admin' ? 'text-primary-600' : 'text-slate-500'}`}>
                  {member.role}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium italic">
                Joined {new Date(member.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold dark:text-white">Invite Team Member</h3>
                <button onClick={() => setIsInviteModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <p className="text-sm text-slate-500 mt-1">Send an invitation to join your organization.</p>
              
              <form onSubmit={handleInvite} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="input-field" 
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select 
                    className="input-field"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="member">Member (Can manage assigned tasks)</option>
                    <option value="admin">Admin (Full organization access)</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsInviteModalOpen(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={inviteMutation.isPending}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    {inviteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Invite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <UserModal 
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        initialData={selectedUser}
        onSubmit={(data) => updateMutation.mutate({ id: selectedUser._id, ...data })}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
};

export default Team;
