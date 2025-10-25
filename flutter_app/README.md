# Asistente Vial México - Flutter App

Aplicación móvil generada con Rocket.new para el sistema de Asistencia Vial México.

## Características Implementadas

### 🎨 Pantallas Generadas
- **Splash Screen**: Pantalla de inicio con gradiente automotriz y animaciones
- **Login Screen**: Autenticación con validación y opciones sociales
- **Registration Screen**: Registro de usuarios con validación de contraseñas
- **Subscription Selection**: Selección de planes (Gratuito, Premium, Administrador)
- **Interactive Map Screen**: Mapa interactivo con marcadores de servicios
- **User Profile Screen**: Perfil de usuario con gestión de vehículos

### 🔑 Credenciales de Prueba
- **Admin**: admin@asistentevial.mx / admin123
- **Premium**: premium@asistentevial.mx / premium123
- **Usuario**: user@asistentevial.mx / user123
- **Demo**: carlos.mendoza@email.com

### 🗺️ Configuración de Google Maps
Para habilitar los mapas, necesitas:

1. Obtener API Key de Google Cloud Console
2. Habilitar APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
   - Maps JavaScript API
   - Places API

3. Reemplazar "YOUR_GOOGLE_MAPS_API_KEY_HERE" en:
   - `android/app/src/main/AndroidManifest.xml`
   - `ios/Runner/AppDelegate.swift`
   - `web/flutter_plugins.js`

### 🚀 Próximos Pasos
1. **Integrar Gemini AI**: Para diagnósticos inteligentes
2. **Integrar Supabase**: Para autenticación y base de datos
3. **Integrar Stripe**: Para procesamiento de pagos

## Instalación

```bash
# Instalar dependencias
flutter pub get

# Ejecutar en desarrollo
flutter run

# Construir para Android
flutter build apk

# Construir para iOS
flutter build ios
```

## Estructura del Proyecto

```
lib/
├── screens/           # Pantallas principales
├── widgets/          # Componentes reutilizables
├── models/           # Modelos de datos
├── services/         # Servicios y APIs
└── utils/            # Utilidades y helpers
```

## Integración con Proyecto Web

Esta app móvil complementa el proyecto web existente en `A:\asistencia_vial\`, proporcionando:

- Experiencia móvil nativa
- Acceso offline a funciones básicas
- Notificaciones push
- Geolocalización precisa
- Integración con sensores del dispositivo

## Tecnologías Utilizadas

- **Flutter**: Framework de desarrollo móvil
- **Google Maps**: Mapas interactivos
- **Material Design**: Interfaz de usuario
- **Provider**: Gestión de estado
- **HTTP**: Comunicación con APIs

## Licencia

© 2024 Asistencia Vial México - Todos los derechos reservados