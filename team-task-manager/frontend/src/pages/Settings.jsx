import { useState } from 'react';
import { 
  User, 
  Lock, 
  Shield, 
  CheckCircle2,
  Loader2,
  Edit,
  UserPlus
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.updateProfile(profileData);
      updateUser(res.data.user);
      toast.success('Updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      return toast.error('Mismatch');
    }
    setIsLoading(true);
    try {
      await authService.changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });
      toast.success('Success');
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'team', name: 'Access', icon: Shield, adminOnly: true },
  ];

  const filteredTabs = tabs.filter(tab => !tab.adminOnly || user?.role === 'admin');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-6 md:p-8 animate-fade-in">
              <h2 className="text-lg font-bold dark:text-white mb-6">Profile</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden">
                      {profileData.avatar ? (
                        <img src={profileData.avatar} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        profileData.name?.charAt(0)
                      )}
                    </div>
                    <label 
                      htmlFor="avatar-upload"
                      className="absolute -bottom-2 -right-2 p-1.5 bg-primary-600 text-white rounded-lg shadow-lg hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </label>
                    <input 
                      id="avatar-upload"
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) return toast.error('Max 2MB');
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfileData({ ...profileData, avatar: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">Photo</h4>
                    <p className="text-xs text-slate-500 mt-1">2MB limit.</p>
                    <div className="flex gap-2 mt-3">
                      <label 
                        htmlFor="avatar-upload"
                        className="text-xs font-bold text-primary-600 hover:underline cursor-pointer"
                      >
                        Upload
                      </label>
                      <button 
                        type="button" 
                        onClick={() => setProfileData({ ...profileData, avatar: '' })}
                        className="text-xs font-bold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="input-field opacity-60 cursor-not-allowed" 
                      value={profileData.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6 md:p-8 animate-fade-in">
              <h2 className="text-lg font-bold dark:text-white mb-6">Security</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    required
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    required
                    minLength={6}
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    required
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                  />
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Update
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'team' && user?.role === 'admin' && (
            <div className="p-6 md:p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold dark:text-white">Team</h2>
                <button className="btn-primary text-xs flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800">
                      <th className="px-4 py-3">Member</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="text-sm">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold dark:text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          Active
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600"><Edit className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
