import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'mx.asistentevial.app',
  appName: 'Asistente Vial México',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#488AFF'
    },
    BackgroundMode: {
      enabled: true,
      title: 'Asistente Vial - Seguimiento Activo'
    }
  }
};

export default config;