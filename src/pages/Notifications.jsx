import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { BellIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const { getAuthHeaders } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/notifications', {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_tip':
        return <BellIcon className="h-5 w-5 text-blue-500" />;
      case 'result':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationBg = (type, read) => {
    if (read) return 'bg-gray-50';
    
    switch (type) {
      case 'new_tip':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'result':
        return 'bg-green-50 border-l-4 border-green-500';
      default:
        return 'bg-white border-l-4 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Ora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h fa`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}g fa`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-red-500 mb-4">
              <p>Errore nel caricamento delle notifiche</p>
            </div>
            <button 
              onClick={fetchNotifications}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Notifiche</h1>
            <div className="flex items-center space-x-2">
              <BellIcon className="h-6 w-6 text-gray-600" />
              <span className="text-sm text-gray-600">
                {notifications.filter(n => !n.read).length} non lette
              </span>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <BellIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Nessuna notifica
              </h3>
              <p className="text-gray-500">
                Le tue notifiche appariranno qui quando seguirai dei pronostici.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    getNotificationBg(notification.type, notification.read)
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.created_at)}
                        </p>
                        {!notification.read && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Nuovo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;