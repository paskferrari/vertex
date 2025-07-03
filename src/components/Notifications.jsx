import { useState } from 'react';
import { motion } from 'framer-motion';

const Notifications = () => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'tips', 'results', 'system'
  
  // Mock notifications data - in a real app, this would come from an API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'tip',
      title: 'New Premium Tip Available',
      message: 'Lakers vs Warriors - Lakers +5.5 at 1.85 odds',
      author: 'ProTipper',
      timestamp: '2024-01-16T10:30:00Z',
      read: false,
      icon: '💡',
      priority: 'high'
    },
    {
      id: 2,
      type: 'result',
      title: 'Bet Result: WIN! 🎉',
      message: 'Your bet on Celtics vs Heat (Under 215.5) won! Profit: +$108',
      timestamp: '2024-01-15T22:45:00Z',
      read: false,
      icon: '✅',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'system',
      title: 'Welcome to Vertex Premium!',
      message: 'Your premium subscription is now active. Enjoy unlimited access to expert tips.',
      timestamp: '2024-01-15T14:20:00Z',
      read: true,
      icon: '⭐',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'tip',
      title: 'Hot Tip Alert 🔥',
      message: 'Barcelona vs Real Madrid - Over 2.5 Goals at 1.75 odds',
      author: 'SoccerExpert',
      timestamp: '2024-01-15T09:15:00Z',
      read: true,
      icon: '🔥',
      priority: 'high'
    },
    {
      id: 5,
      type: 'result',
      title: 'Bet Result: Loss',
      message: 'Your bet on Djokovic vs Nadal (Djokovic ML) lost. Better luck next time!',
      timestamp: '2024-01-14T18:30:00Z',
      read: true,
      icon: '❌',
      priority: 'low'
    },
    {
      id: 6,
      type: 'system',
      title: 'ROI Milestone Achieved! 🎯',
      message: 'Congratulations! You\'ve reached 20% ROI this month.',
      timestamp: '2024-01-14T12:00:00Z',
      read: true,
      icon: '🎯',
      priority: 'medium'
    },
    {
      id: 7,
      type: 'tip',
      title: 'Free Tip of the Day',
      message: 'Chiefs vs Bills - Chiefs -3.5 at 1.95 odds',
      author: 'NFLInsider',
      timestamp: '2024-01-13T08:00:00Z',
      read: true,
      icon: '🆓',
      priority: 'low'
    },
    {
      id: 8,
      type: 'system',
      title: 'Weekly Report Ready 📊',
      message: 'Your weekly performance report is available in the dashboard.',
      timestamp: '2024-01-12T16:45:00Z',
      read: true,
      icon: '📊',
      priority: 'low'
    }
  ]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Get relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return time.toLocaleDateString();
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-400';
      case 'medium':
        return 'border-l-yellow-400';
      case 'low':
        return 'border-l-gray-400';
      default:
        return 'border-l-gray-400';
    }
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const badges = {
      tip: { label: 'Tip', color: 'bg-blue-500/20 text-blue-400 border-blue-400/30' },
      result: { label: 'Result', color: 'bg-green-500/20 text-green-400 border-green-400/30' },
      system: { label: 'System', color: 'bg-purple-500/20 text-purple-400 border-purple-400/30' }
    };
    
    const badge = badges[type] || badges.system;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
          <p className="text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="mt-4 sm:mt-0 btn-secondary text-sm"
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All', count: notifications.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'tips', label: 'Tips', count: notifications.filter(n => n.type === 'tip').length },
          { key: 'results', label: 'Results', count: notifications.filter(n => n.type === 'result').length },
          { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === filterOption.key
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'bg-dark-lighter text-gray-400 hover:text-white hover:bg-gray-600'
            }`}
          >
            {filterOption.label} ({filterOption.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-3"
      >
        {filteredNotifications.length === 0 ? (
          <motion.div variants={itemVariants} className="card text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-gray-400">
              {filter === 'unread' 
                ? 'All notifications have been read!' 
                : 'No notifications match your current filter.'}
            </p>
          </motion.div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              variants={itemVariants}
              className={`card hover:border-primary/30 transition-all cursor-pointer border-l-4 ${
                getPriorityColor(notification.priority)
              } ${
                !notification.read ? 'bg-primary/5 border-primary/20' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    !notification.read 
                      ? 'bg-primary/20 border-2 border-primary/30' 
                      : 'bg-dark-lighter border-2 border-gray-600'
                  }`}>
                    <span className="text-xl">{notification.icon}</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className={`font-semibold ${
                        !notification.read ? 'text-white' : 'text-gray-300'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(notification.type)}
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {getRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    !notification.read ? 'text-gray-300' : 'text-gray-400'
                  }`}>
                    {notification.message}
                  </p>
                  
                  {notification.author && (
                    <p className="text-xs text-gray-500">
                      by {notification.author}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Load More Button (for future pagination) */}
      {filteredNotifications.length > 0 && (
        <div className="text-center pt-6">
          <button className="btn-secondary">
            Load More Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;