import { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  CreditCard,
  CheckCircle2,
  Loader2
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await authService.updateProfile(profileData);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'team', name: 'Team Access', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
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

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-6 md:p-8 animate-fade-in">
              <h2 className="text-lg font-bold dark:text-white mb-6">Profile Information</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700">
                      {profileData.avatar ? <img src={profileData.avatar} className="w-full h-full rounded-2xl object-cover" /> : profileData.name.charAt(0)}
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 p-1.5 bg-primary-600 text-white rounded-lg shadow-lg hover:scale-110 transition-transform">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">Profile Photo</h4>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG or GIF. Max 2MB.</p>
                    <div className="flex gap-2 mt-3">
                      <button type="button" className="text-xs font-bold text-primary-600 hover:underline">Upload new</button>
                      <button type="button" className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
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
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== 'profile' && (
            <div className="p-20 text-center flex flex-col items-center justify-center animate-fade-in">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold dark:text-white">Module Coming Soon</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-[250px]">We're still fine-tuning this section for the perfect experience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
