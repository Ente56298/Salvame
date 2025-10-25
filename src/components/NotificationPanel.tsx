import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
    
    // Simulate notifications for demo
    const interval = setInterval(() => {
      addNotification({
        title: 'Sistema',
        message: 'Verificación de estado completada',
        type: 'info'
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        const parsed = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsed);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = (notifs: Notification[]) => {
    localStorage.setItem('notifications', JSON.stringify(notifs));
    setNotifications(notifs);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    const updated = [newNotification, ...notifications].slice(0, 50); // Keep last 50
    saveNotifications(updated);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-12 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border z-50">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Notificaciones</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 mt-2"
          >
            Marcar todas como leídas ({unreadCount})
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hay notificaciones
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-700 ${
                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="w-2 h-2 bg-blue-600 rounded-full mt-2 hover:bg-blue-700"
                    title="Marcar como leída"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className={`font-medium text-sm ${getTypeColor(notification.type)}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500 ml-2">
                      {notification.timestamp.toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;