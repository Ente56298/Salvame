import React from 'react';

const SocialProof: React.FC = () => {
    const stats = [
        { number: "2,847", label: "Emergencias Resueltas", icon: "🚨" },
        { number: "4.9", label: "Rating Promedio", icon: "⭐" },
        { number: "< 8min", label: "Tiempo Respuesta", icon: "⚡" },
        { number: "24/7", label: "Disponibilidad", icon: "🕐" }
    ];

    const testimonials = [
        { name: "María G.", text: "Me salvó en carretera a las 2 AM", rating: 5 },
        { name: "Carlos R.", text: "Súper rápido y confiable", rating: 5 },
        { name: "Ana L.", text: "Mejor que AAA, más barato", rating: 5 }
    ];

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold text-white">{stat.number}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-4">
                {testimonials.map((testimonial, i) => (
                    <div key={i} className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex mb-2">
                            {[...Array(testimonial.rating)].map((_, j) => (
                                <span key={j} className="text-yellow-400 text-sm">⭐</span>
                            ))}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">"{testimonial.text}"</p>
                        <p className="text-gray-400 text-xs">- {testimonial.name}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-6">
                <p className="text-gray-400 text-xs">
                    Únete a miles de conductores que ya confían en nosotros
                </p>
            </div>
        </div>
    );
};

export default SocialProof;