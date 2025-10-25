// Asistente Vial México - Versión JavaScript Vanilla
// Basado en App.tsx para máxima compatibilidad

class AsistenteVial {
    constructor() {
        this.user = null;
        this.theme = 'dark';
        this.location = null;
        this.activeFeature = null;
        this.isSOSActive = false;
        
        this.init();
    }
    
    init() {
        this.loadTheme();
        this.loadUser();
        this.getLocation();
        this.render();
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.theme = savedTheme;
        document.documentElement.className = savedTheme;
    }
    
    loadUser() {
        const userData = localStorage.getItem('currentUser');
        this.user = userData ? JSON.parse(userData) : null;
    }
    
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    this.updateMap();
                },
                (error) => console.error('Error de ubicación:', error)
            );
        }
    }
    
    login() {
        const mockUser = {
            id: '1',
            name: 'Usuario Demo',
            email: 'demo@example.com',
            role: 'user',
            subscriptionStatus: 'free'
        };
        
        this.user = mockUser;
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        this.render();
    }
    
    logout() {
        this.user = null;
        localStorage.removeItem('currentUser');
        this.render();
    }
    
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        document.documentElement.className = this.theme;
    }
    
    activateSOS() {
        this.isSOSActive = true;
        this.showSOSModal();
    }
    
    showSOSModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                <h2 class="text-xl font-bold text-red-600 mb-4">🆘 EMERGENCIA ACTIVADA</h2>
                <p class="mb-4">Se ha enviado tu ubicación a los servicios de emergencia.</p>
                <div class="flex space-x-2">
                    <button onclick="window.open('tel:911')" class="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">
                        Llamar 911
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove(); app.isSOSActive = false" 
                            class="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400">
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    selectFeature(feature) {
        this.activeFeature = feature;
        this.showFeaturePanel(feature);
    }
    
    showAdminPanel() {
        this.showFeaturePanel('admin');
    }
    
    showAnalyticsPanel() {
        this.showFeaturePanel('analytics');
    }
    
    showPartnersPanel() {
        this.showFeaturePanel('partners');
    }
    
    showFeaturePanel(feature) {
        const existing = document.getElementById('feature-panel');
        if (existing) existing.remove();
        
        const panel = document.createElement('div');
        panel.id = 'feature-panel';
        panel.className = 'fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-lg z-20 p-6';
        
        const titles = {
            evaluation: 'Diagnóstico IA',
            assistance: 'Asistencia',
            services: 'Servicios',
            parts: 'Refacciones',
            traffic: 'Tráfico',
            profile: 'Perfil'
        };
        
        panel.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">${titles[feature] || feature}</h2>
                <button onclick="this.parentElement.parentElement.remove(); app.activeFeature = null" 
                        class="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div class="space-y-4">
                ${this.getFeatureContent(feature)}
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    getFeatureContent(feature) {
        switch (feature) {
            case 'profile':
                return `
                    <div class="text-center mb-6">
                        <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                            ${this.user?.name?.charAt(0) || 'U'}
                        </div>
                        <h3 class="font-semibold">${this.user?.name || 'Usuario'}</h3>
                        <p class="text-gray-600">${this.user?.email || 'email@example.com'}</p>
                    </div>
                    <div class="space-y-4">
                        <button onclick="app.toggleTheme()" class="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Cambiar Tema
                        </button>
                        <button onclick="app.logout()" class="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Cerrar Sesión
                        </button>
                    </div>
                `;
            case 'evaluation':
                return `
                    <p>🤖 Diagnóstico con IA</p>
                    <p>Describe el problema de tu vehículo y obtén un diagnóstico inteligente.</p>
                    <textarea class="w-full p-2 border rounded" placeholder="Describe el problema..."></textarea>
                    <button class="w-full p-2 bg-blue-600 text-white rounded">Diagnosticar</button>
                `;
            case 'assistance':
                return `
                    <p>🔧 Solicitar Asistencia</p>
                    <div class="space-y-2">
                        <button class="w-full p-2 bg-green-600 text-white rounded">Mecánico</button>
                        <button class="w-full p-2 bg-red-600 text-white rounded">Médico</button>
                        <button class="w-full p-2 bg-yellow-600 text-white rounded">Combustible</button>
                        <button class="w-full p-2 bg-purple-600 text-white rounded">Grúa</button>
                    </div>
                `;
            case 'admin':
                return `
                    <p>⚙️ Panel de Administración</p>
                    <div class="space-y-4">
                        <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                            <h4 class="font-semibold mb-2">Estadísticas</h4>
                            <p>Usuarios activos: 1,234</p>
                            <p>Servicios completados: 5,678</p>
                        </div>
                        <button class="w-full p-2 bg-purple-600 text-white rounded">Gestionar Usuarios</button>
                        <button class="w-full p-2 bg-indigo-600 text-white rounded">Ver Reportes</button>
                    </div>
                `;
            case 'analytics':
                return `
                    <p>📊 Análisis en Tiempo Real</p>
                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-2">
                            <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded text-center">
                                <div class="text-2xl font-bold">89%</div>
                                <div class="text-sm">Satisfacción</div>
                            </div>
                            <div class="bg-green-100 dark:bg-green-900 p-3 rounded text-center">
                                <div class="text-2xl font-bold">24</div>
                                <div class="text-sm">SOS Hoy</div>
                            </div>
                        </div>
                        <button class="w-full p-2 bg-blue-600 text-white rounded">Ver Dashboard Completo</button>
                    </div>
                `;
            case 'partners':
                return `
                    <p>🤝 Red de Socios</p>
                    <div class="space-y-3">
                        <div class="border rounded p-3">
                            <h4 class="font-semibold">Taller Central</h4>
                            <p class="text-sm text-gray-600">⭐ 4.8 • 2.3 km</p>
                            <button class="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm">Contactar</button>
                        </div>
                        <div class="border rounded p-3">
                            <h4 class="font-semibold">Refacciones Express</h4>
                            <p class="text-sm text-gray-600">⭐ 4.6 • 1.8 km</p>
                            <button class="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm">Contactar</button>
                        </div>
                        <button class="w-full p-2 bg-blue-600 text-white rounded">Ver Todos los Socios</button>
                    </div>
                `;
            case 'explore':
                return `
                    <p>🗺️ Explorar Área</p>
                    <div class="space-y-3">
                        <div class="grid grid-cols-2 gap-2">
                            <button class="p-3 bg-blue-100 dark:bg-blue-900 rounded text-center">
                                <div class="text-2xl mb-1">🏛️</div>
                                <div class="text-sm">Museos</div>
                            </button>
                            <button class="p-3 bg-green-100 dark:bg-green-900 rounded text-center">
                                <div class="text-2xl mb-1">🌳</div>
                                <div class="text-sm">Parques</div>
                            </button>
                            <button class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded text-center">
                                <div class="text-2xl mb-1">🍽️</div>
                                <div class="text-sm">Restaurantes</div>
                            </button>
                            <button class="p-3 bg-purple-100 dark:bg-purple-900 rounded text-center">
                                <div class="text-2xl mb-1">⛽</div>
                                <div class="text-sm">Gasolineras</div>
                            </button>
                        </div>
                    </div>
                `;
            default:
                return `<p>Panel de ${feature} - En desarrollo</p>`;
        }
    }
    
    updateMap() {
        const mapElement = document.getElementById('map-content');
        if (mapElement && this.location) {
            mapElement.innerHTML = `
                <div class="text-center p-8">
                    <div class="text-6xl mb-4">🗺️</div>
                    <h3 class="text-xl font-semibold mb-2">Mapa Interactivo</h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        Ubicación: ${this.location.lat.toFixed(4)}, ${this.location.lon.toFixed(4)}
                    </p>
                </div>
            `;
        }
    }
    
    render() {
        const app = document.getElementById('app');
        
        if (!this.user) {
            app.innerHTML = this.renderLanding();
        } else {
            app.innerHTML = this.renderDashboard();
            this.updateMap();
        }
    }
    
    renderLanding() {
        return `
            <div class="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
                <div class="max-w-4xl mx-auto text-center text-white">
                    <h1 class="text-5xl font-bold mb-6">🚗 Asistente Vial México</h1>
                    <p class="text-xl mb-8 opacity-90">Tu copiloto inteligente en las carreteras mexicanas</p>
                    
                    <div class="grid md:grid-cols-2 gap-8 mb-8">
                        <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                            <h2 class="text-2xl font-semibold mb-4">Para Conductores</h2>
                            <ul class="space-y-2 text-left">
                                <li>🤖 Diagnóstico con IA</li>
                                <li>🆘 Emergencias SOS</li>
                                <li>🔧 Búsqueda de talleres</li>
                                <li>⛽ Localización de servicios</li>
                            </ul>
                        </div>
                        
                        <div class="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6">
                            <h2 class="text-2xl font-semibold mb-4">Para Socios</h2>
                            <ul class="space-y-2 text-left">
                                <li>📊 Gestión de perfil</li>
                                <li>🎯 Conexión con clientes</li>
                                <li>🤖 Asistente IA personalizado</li>
                                <li>📈 Análisis de rendimiento</li>
                            </ul>
                        </div>
                    </div>
                    
                    <button onclick="app.login()" class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                        Comenzar Demo
                    </button>
                </div>
            </div>
        `;
    }
    
    renderDashboard() {
        return `
            <div class="relative min-h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
                <!-- Sidebar -->
                <div class="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-10 flex flex-col">
                    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-lg font-semibold">AVMX</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Hola, ${this.user.name}</p>
                    </div>
                    
                    <div class="p-4">
                        <button onclick="app.activateSOS()" class="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">
                            🆘 EMERGENCIA SOS
                        </button>
                    </div>
                    
                    <nav class="flex-1 p-4 space-y-2">
                        <button onclick="app.selectFeature('evaluation')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">🤖</span>
                            <span>Diagnóstico IA</span>
                        </button>
                        <button onclick="app.selectFeature('assistance')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">🔧</span>
                            <span>Asistencia</span>
                        </button>
                        <button onclick="app.selectFeature('services')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">⛽</span>
                            <span>Servicios</span>
                        </button>
                        <button onclick="app.selectFeature('parts')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">🔩</span>
                            <span>Refacciones</span>
                        </button>
                        <button onclick="app.selectFeature('traffic')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">🚦</span>
                            <span>Tráfico</span>
                        </button>
                        <button onclick="app.selectFeature('explore')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">🗺️</span>
                            <span>Explorar</span>
                        </button>
                        <button onclick="app.selectFeature('partners')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">🤝</span>
                            <span>Socios</span>
                        </button>
                        <button onclick="app.selectFeature('analytics')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">📊</span>
                            <span>Análisis</span>
                        </button>
                        <button onclick="app.selectFeature('admin')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">⚙️</span>
                            <span>Admin</span>
                        </button>
                    </nav>
                    
                    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button onclick="app.selectFeature('profile')" class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span class="text-xl">👤</span>
                            <span>Perfil</span>
                        </button>
                    </div>
                </div>
                
                <!-- Map -->
                <div class="absolute inset-0 ml-64">
                    <div id="map-content" class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                        <div class="text-center p-8">
                            <div class="animate-spin text-4xl mb-4">🔄</div>
                            <p>Obteniendo ubicación...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Inicializar aplicación
const app = new AsistenteVial();