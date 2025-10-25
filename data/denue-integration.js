// DENUE (INEGI) Integration for Partner Database
// https://www.inegi.org.mx/app/mapa/denue/default.aspx

const DENUE_CATEGORIES = {
  talleres_mecanicos: {
    code: "811111",
    description: "Servicios de reparación mecánica en general de automóviles y camiones",
    target: 200
  },
  gruas_arrastre: {
    code: "488210", 
    description: "Servicios de grúas para vehículos",
    target: 100
  },
  refaccionarias: {
    code: "468411",
    description: "Comercio al por menor de refacciones y accesorios nuevos para automóviles",
    target: 150
  },
  servicios_especializados: {
    code: "811112",
    description: "Servicios de reparación eléctrica y electrónica de automóviles",
    target: 50
  }
};

const METRO_AREAS = [
  { name: "CDMX", code: "09", priority: 1 },
  { name: "Estado de México", code: "15", priority: 1 },
  { name: "Guadalajara", code: "14", priority: 2 },
  { name: "Monterrey", code: "19", priority: 2 }
];

// Generate partner prospects from DENUE data
function generatePartnerProspects() {
  const prospects = [];
  
  Object.entries(DENUE_CATEGORIES).forEach(([category, config]) => {
    for (let i = 0; i < config.target; i++) {
      prospects.push({
        id: `${category}_${i + 1}`,
        category: category,
        denue_code: config.code,
        name: generateBusinessName(category, i),
        location: getRandomLocation(),
        contact: generateContact(),
        services: getServicesForCategory(category),
        status: "prospect",
        priority: getLocationPriority(),
        estimated_revenue: estimateRevenue(category)
      });
    }
  });
  
  return prospects;
}

function generateBusinessName(category, index) {
  const names = {
    talleres_mecanicos: [
      "Taller El Güero", "Mecánica Los Compadres", "Taller Integral",
      "Mecánica del Valle", "Taller Express", "Mecánica Profesional"
    ],
    gruas_arrastre: [
      "Grúas Rápidas 24/7", "El Rescate", "Auxilio Total",
      "Grúas Express", "Rescate Vial", "Grúas del Norte"
    ],
    refaccionarias: [
      "Refaccionaria La Central", "Mundo Motor", "Piezas y Más",
      "AutoMax", "Refacciones del Valle", "La Casa de las Refacciones"
    ],
    servicios_especializados: [
      "Eléctrico Chispa", "Carrocerías del Norte", "Pintura Automotriz",
      "Sistemas Eléctricos", "Hojalatería Express", "Diagnóstico Pro"
    ]
  };
  
  return names[category][index % names[category].length] + ` ${Math.floor(index / 6) + 1}`;
}

function getRandomLocation() {
  const locations = [
    "Naucalpan", "Tlalnepantla", "Ecatepec", "Nezahualcóyotl",
    "Gustavo A. Madero", "Cuautitlán Izcalli", "Tultitlán", "Atizapán",
    "Coacalco", "Texcoco", "Chalco", "Metepec", "Toluca"
  ];
  return locations[Math.floor(Math.random() * locations.length)];
}

function generateContact() {
  return `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function getServicesForCategory(category) {
  const services = {
    talleres_mecanicos: ["Mecánica general", "Frenos", "Suspensión", "Motor", "Transmisión"],
    gruas_arrastre: ["Arrastre", "Rescate carretera", "Traslados", "Servicios 24/7"],
    refaccionarias: ["Autopartes originales", "Refacciones", "Accesorios", "Lubricantes"],
    servicios_especializados: ["Sistemas eléctricos", "Hojalatería", "Pintura", "Diagnóstico"]
  };
  return services[category] || [];
}

function getLocationPriority() {
  return Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low";
}

function estimateRevenue(category) {
  const baseRevenue = {
    talleres_mecanicos: 1200,
    gruas_arrastre: 1800,
    refaccionarias: 800,
    servicios_especializados: 1500
  };
  
  const variation = 0.3; // ±30%
  const base = baseRevenue[category];
  return Math.round(base * (1 + (Math.random() - 0.5) * variation));
}

// Export for use in partner database
module.exports = {
  DENUE_CATEGORIES,
  METRO_AREAS,
  generatePartnerProspects
};