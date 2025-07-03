import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  
  // Mock user data - in a real app, this would come from localStorage or API
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    initials: 'JD',
    plan: 'premium', // 'free', 'premium', 'pro'
    joinDate: '2023-01-15',
    planExpiry: '2024-02-15',
    totalBets: 127,
    winRate: 68.5,
    totalProfit: 1250,
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    preferences: {
      currency: 'USD',
      timezone: 'UTC-5',
      theme: 'dark'
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    navigate('/');
  };

  const handleSave = () => {
    setUser({ ...editForm });
    setIsEditing(false);
    // In a real app, this would make an API call
    localStorage.setItem('user', JSON.stringify(editForm));
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setIsEditing(false);
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'premium':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white">
            ⭐ Premium
          </div>
        );
      case 'pro':
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            💎 Pro
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-600 text-gray-300">
            🆓 Free
          </div>
        );
    }
  };

  const getPlanFeatures = (plan) => {
    switch (plan) {
      case 'premium':
        return [
          '✅ 50 premium tips per month',
          '✅ Advanced analytics',
          '✅ Email notifications',
          '✅ Priority support'
        ];
      case 'pro':
        return [
          '✅ Unlimited premium tips',
          '✅ Advanced analytics',
          '✅ All notification types',
          '✅ Priority support',
          '✅ Custom strategies',
          '✅ API access'
        ];
      default:
        return [
          '✅ 5 free tips per month',
          '❌ Limited analytics',
          '❌ Email notifications',
          '❌ Priority support'
        ];
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-dark p-4 md:p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Manage your account and subscription</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={itemVariants} className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{user.initials}</span>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                  <p className="text-gray-500 text-sm">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
                
                <div className="mt-4 md:mt-0">
                  {getPlanBadge(user.plan)}
                  {user.plan !== 'free' && (
                    <p className="text-gray-400 text-sm mt-1">
                      Expires: {new Date(user.planExpiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{user.totalBets}</p>
                  <p className="text-gray-400 text-sm">Total Bets</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{user.winRate}%</p>
                  <p className="text-gray-400 text-sm">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">${user.totalProfit}</p>
                  <p className="text-gray-400 text-sm">Total Profit</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Plan Details & Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Current Plan */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">Current Plan</h3>
            <div className="space-y-3">
              {getPlanFeatures(user.plan).map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            {user.plan === 'free' && (
              <div className="mt-6">
                <button className="btn-primary w-full">
                  Upgrade to Premium
                </button>
              </div>
            )}
            
            {user.plan === 'premium' && (
              <div className="mt-6 space-y-2">
                <button className="btn-primary w-full">
                  Upgrade to Pro
                </button>
                <button className="btn-secondary w-full">
                  Manage Subscription
                </button>
              </div>
            )}
            
            {user.plan === 'pro' && (
              <div className="mt-6">
                <button className="btn-secondary w-full">
                  Manage Subscription
                </button>
              </div>
            )}
          </div>
          
          {/* Account Actions */}
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-secondary w-full"
              >
                Edit Profile
              </button>
              
              <button className="btn-secondary w-full">
                Change Password
              </button>
              
              <button className="btn-secondary w-full">
                Download Data
              </button>
              
              <button className="btn-secondary w-full">
                Notification Settings
              </button>
              
              <div className="pt-4 border-t border-gray-600">
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Information */}
        <motion.div variants={itemVariants} className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Personal Information</h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  className="btn-primary text-sm px-3 py-1"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="btn-secondary text-sm px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input w-full"
                />
              ) : (
                <p className="text-white">{user.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="input w-full"
                />
              ) : (
                <p className="text-white">{user.email}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div variants={itemVariants} className="card">
          <h3 className="text-xl font-semibold text-white mb-6">Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
              {isEditing ? (
                <select
                  value={editForm.preferences.currency}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    preferences: {
                      ...editForm.preferences,
                      currency: e.target.value
                    }
                  })}
                  className="input w-full"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              ) : (
                <p className="text-white">{user.preferences.currency}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
              {isEditing ? (
                <select
                  value={editForm.preferences.timezone}
                  onChange={(e) => setEditForm({
                    ...editForm,
                    preferences: {
                      ...editForm.preferences,
                      timezone: e.target.value
                    }
                  })}
                  className="input w-full"
                >
                  <option value="UTC-5">UTC-5 (EST)</option>
                  <option value="UTC-8">UTC-8 (PST)</option>
                  <option value="UTC+0">UTC+0 (GMT)</option>
                  <option value="UTC+1">UTC+1 (CET)</option>
                </select>
              ) : (
                <p className="text-white">{user.preferences.timezone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
              <p className="text-white capitalize">{user.preferences.theme}</p>
            </div>
          </div>
          
          {/* Notification Preferences */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Notifications</h4>
            <div className="space-y-4">
              {Object.entries(user.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{key} Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEditing ? editForm.notifications[key] : value}
                      onChange={(e) => isEditing && setEditForm({
                        ...editForm,
                        notifications: {
                          ...editForm.notifications,
                          [key]: e.target.checked
                        }
                      })}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;