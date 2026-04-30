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
  CheckCircle2
} from 'lucide-react';
import { userService } from '../services/api';
import { toast } from 'react-hot-toast';

const Team = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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

  const handleInvite = (e) => {
    e.preventDefault();
    inviteMutation.mutate({ email: inviteEmail, role: inviteRole });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Team Members</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your organization's members and their access levels.</p>
        </div>
        
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
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
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="font-bold dark:text-white">{member.name}</h3>
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
              <h3 className="text-xl font-bold dark:text-white">Invite Team Member</h3>
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
    </div>
  );
};

export default Team;
