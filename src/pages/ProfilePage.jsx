import { useState } from 'react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  // Placeholder user data - in a real app, this would come from an API
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2023-01-15',
    totalBets: 45,
    winRate: 68,
    favoritesSports: ['Basketball', 'Soccer', 'Tennis'],
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

  const handleSave = () => {
    setUser({ ...editForm });
    setIsEditing(false);
    // In a real app, this would make an API call
    console.log('Profile updated:', editForm);
  };

  const handleCancel = () => {
    setEditForm({ ...user });
    setIsEditing(false);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
              <p className="text-gray-400">Manage your account settings and preferences</p>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={handleSave}
                  className="btn-primary"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Info */}
        <motion.div variants={itemVariants} className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Personal Information</h2>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
              <p className="text-white">{new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Total Bets</label>
              <p className="text-white">{user.totalBets}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
            <p className="text-gray-400 text-sm mb-2">Win Rate</p>
            <p className="text-2xl font-bold text-white">{user.winRate}%</p>
          </div>
          
          <div className="card bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20">
            <p className="text-gray-400 text-sm mb-2">Total Bets</p>
            <p className="text-2xl font-bold text-white">{user.totalBets}</p>
          </div>
          
          <div className="card bg-gradient-to-br from-green-500/20 to-green-400/10 border border-green-400/20">
            <p className="text-gray-400 text-sm mb-2">Favorite Sports</p>
            <p className="text-sm text-green-400">{user.favoritesSports.join(', ')}</p>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={itemVariants} className="card mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
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
        </motion.div>

        {/* App Preferences */}
        <motion.div variants={itemVariants} className="card">
          <h2 className="text-xl font-semibold text-white mb-6">App Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;