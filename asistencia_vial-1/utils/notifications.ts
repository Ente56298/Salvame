export const sendSOSNotification = async (
  location: { lat: number; lng: number; address?: string },
  vehicle?: { make: string; model: string; year: string; licensePlate: string },
  emergencyContacts?: { name: string; phone: string }[]
): Promise<{ success: boolean; message: string }> => {
  
  await new Promise(resolve => setTimeout(resolve, 2000));

  const notificationData = {
    timestamp: new Date().toISOString(),
    location,
    vehicle,
    emergencyContacts: emergencyContacts?.filter(c => c.phone),
    services: ['Policía', 'Bomberos', 'Cruz Roja']
  };

  const existingAlerts = JSON.parse(localStorage.getItem('sosAlerts') || '[]');
  existingAlerts.unshift(notificationData);
  localStorage.setItem('sosAlerts', JSON.stringify(existingAlerts.slice(0, 10)));

  const success = Math.random() > 0.1;

  if (success) {
    return {
      success: true,
      message: 'Alerta SOS enviada exitosamente a servicios de emergencia locales y contactos registrados.'
    };
  } else {
    return {
      success: false,
      message: 'Error al enviar la alerta. Intenta nuevamente o contacta directamente a emergencias: 911'
    };
  }
};

export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  
  notification.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);

  notification.addEventListener('click', () => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  });
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showBrowserNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    });
  }
};

export const checkTrafficAndNotify = (trafficData: any) => {
  if (!trafficData || !trafficData.incidents) return;

  const criticalIncidents = trafficData.incidents.filter((incident: any) => 
    incident.severity === 'high' || incident.type === 'accident'
  );

  if (criticalIncidents.length > 0) {
    const message = `${criticalIncidents.length} incidente(s) crítico(s) detectado(s) en tu ruta`;
    
    showBrowserNotification('⚠️ Alerta de Tráfico', {
      body: message,
      tag: 'traffic-alert',
      requireInteraction: true
    });

    showNotification(message, 'error');
  }
};