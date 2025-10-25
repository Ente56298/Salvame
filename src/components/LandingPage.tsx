// Arquitecto: DIOS | Implementador: Jorge Hernández
import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-gray-100 text-gray-800 font-sans">
      <header className="bg-white shadow-md p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🚗 Salvame</h1>
          <ul className="flex space-x-6">
            <li><a href="#servicios" className="hover:text-blue-600">Servicios</a></li>
            <li><a href="#beneficios" className="hover:text-blue-600">Beneficios</a></li>
            <li><a href="#testimonios" className="hover:text-blue-600">Testimonios</a></li>
            <li><a href="#contacto" className="hover:text-blue-600">Contacto</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto p-8">
        <section className="text-center my-16">
          <h2 className="text-4xl font-bold mb-2">Asistencia Vial Inteligente con IA</h2>
          <p className="text-xl text-gray-600 mb-6">
            <strong>4 agentes especializados + Grúa, cerrajería, paso de corriente y más</strong>
          </p>
          <a href="#" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors">
            Cotiza tu plan
          </a>
        </section>

        <section id="servicios" className="my-12">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros Servicios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">🚛</div>
              <h3 className="text-xl font-semibold mb-2">Grúa</h3>
              <p>Traslado seguro y profesional de tu vehículo</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">🔑</div>
              <h3 className="text-xl font-semibold mb-2">Cerrajería</h3>
              <p>Apertura de puertas sin daños</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">🔋</div>
              <h3 className="text-xl font-semibold mb-2">Paso de Corriente</h3>
              <p>Iniciamos tu batería al instante</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">🛞</div>
              <h3 className="text-xl font-semibold mb-2">Cambio de llanta</h3>
              <p>Reemplazo de llanta ponchada</p>
            </div>
          </div>
        </section>

        <section className="my-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-8">🤖 4 Agentes IA Especializados</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🚨</div>
              <h3 className="font-semibold">Emergencias</h3>
              <p className="text-sm">Primeros auxilios y protocolo</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔧</div>
              <h3 className="font-semibold">Mecánico</h3>
              <p className="text-sm">Diagnóstico inteligente</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚖️</div>
              <h3 className="font-semibold">Legal</h3>
              <p className="text-sm">Asesoría vial y seguros</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <h3 className="font-semibold">Navegación</h3>
              <p className="text-sm">Rutas optimizadas</p>
            </div>
          </div>
        </section>

        <section id="beneficios" className="my-12">
          <h2 className="text-3xl font-bold text-center mb-8">¿Por qué elegirnos?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">⏰</div>
              <h3 className="text-xl font-semibold mb-2">Disponibilidad 24/7</h3>
              <p>Estamos para ti a cualquier hora</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Respuesta &lt; 2 min</h3>
              <p>5x más rápido que la competencia</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="text-xl font-semibold mb-2">Modo Offline</h3>
              <p>Funciona sin internet</p>
            </div>
          </div>
        </section>

        <section id="testimonios" className="my-12">
          <h2 className="text-3xl font-bold text-center mb-8">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <blockquote className="bg-white p-6 rounded-lg shadow-lg">
              <p className="italic">"El servicio de grúa fue rápido y eficiente. El agente IA me guió mientras esperaba. ¡Increíble!"</p>
              <footer className="mt-4 font-bold">- María G., CDMX</footer>
            </blockquote>
            <blockquote className="bg-white p-6 rounded-lg shadow-lg">
              <p className="italic">"Me quedé sin batería en carretera. La app funcionó offline y el mecánico llegó en 15 minutos."</p>
              <footer className="mt-4 font-bold">- Juan P., Monterrey</footer>
            </blockquote>
          </div>
        </section>

        <section className="text-center my-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">¿Listo para viajar con tranquilidad?</h2>
          <p className="mb-6">No esperes a tener una emergencia. 4 agentes IA + asistencia vial profesional.</p>
          <a href="#" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors">
            Obtén tu plan ahora
          </a>
        </section>
      </main>

      <footer id="contacto" className="bg-gray-800 text-white p-8 mt-12">
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold">🚗 Salvame</h3>
            <p className="text-gray-400">Tu copiloto inteligente en el camino</p>
            <p className="text-sm text-gray-500 mt-4">© 2025 Salvame. Todos los derechos reservados.</p>
          </div>
          <div></div>
          <div>
            <h3 className="text-xl font-bold">Social Media</h3>
            <ul className="flex space-x-4 mt-2">
              <li><a href="#" className="hover:text-blue-400">Facebook</a></li>
              <li><a href="#" className="hover:text-pink-400">Instagram</a></li>
              <li><a href="#" className="hover:text-sky-400">Twitter</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
