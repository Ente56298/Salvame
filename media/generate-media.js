const fs = require('fs');

// Generate SVG placeholders for presentation
const generateSVG = (width, height, text, color) => `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="16">${text}</text>
</svg>`;

// Hero background
fs.writeFileSync('hero-background.svg', generateSVG(1920, 1080, '🚗 Carretera Mexicana con GPS', '#1e40af'));

// Problem visual
fs.writeFileSync('problem-visual.svg', generateSVG(800, 600, '⚠️ Coche Varado - Emergencia', '#ef4444'));

// App mockup
fs.writeFileSync('app-mockup.svg', generateSVG(400, 800, '📱 Asistente Vial App', '#10b981'));

// Value proposition icons
const icons = ['🛡️ Seguridad', '🧠 IA 24/7', '🔧 Red Servicios', '📊 Analítica'];
icons.forEach((icon, i) => {
  fs.writeFileSync(`value-icon-${i+1}.svg`, generateSVG(200, 200, icon, '#f59e0b'));
});

console.log('✅ Medios SVG generados para presentación');