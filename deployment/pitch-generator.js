#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class PitchGenerator {
  constructor() {
    this.deck = JSON.parse(fs.readFileSync(path.join(__dirname, 'pitch-deck.json'), 'utf8'));
  }

  generateHTML() {
    const slides = this.deck.slides.map(slide => this.renderSlide(slide)).join('\n');
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.deck.title}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="design/professional-design-system.css">
    <style>
        .chart-container { width: 400px; height: 300px; margin: 0 auto; }
    </style>
</head>
<body class="bg-gray-900 text-white font-sans">
    <div id="presentation" class="relative">
        ${slides}
    </div>
    
    <div class="fixed bottom-4 right-4 flex gap-2">
        <button onclick="prevSlide()" class="bg-blue-600 px-4 py-2 rounded">←</button>
        <span id="slideCounter" class="bg-gray-700 px-4 py-2 rounded">1/${this.deck.slides.length}</span>
        <button onclick="nextSlide()" class="bg-blue-600 px-4 py-2 rounded">→</button>
    </div>

    <script>
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        
        function showSlide(n) {
            slides.forEach(s => s.classList.add('hidden'));
            slides[n].classList.remove('hidden');
            document.getElementById('slideCounter').textContent = \`\${n+1}/${slides.length}\`;
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        });
        
        // Initialize charts
        function initCharts() {
            // Financial Chart
            const financialCtx = document.getElementById('financialChart');
            if (financialCtx) {
                new Chart(financialCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Costos', 'Ingresos'],
                        datasets: [{
                            data: [21500, 125000],
                            backgroundColor: ['#ef4444', '#10b981'],
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { 
                                beginAtZero: true,
                                ticks: { color: '#ffffff' },
                                grid: { color: '#374151' }
                            },
                            x: { 
                                ticks: { color: '#ffffff' },
                                grid: { color: '#374151' }
                            }
                        }
                    }
                });
            }
            
            // Revenue Distribution Chart
            const revenueCtx = document.getElementById('revenueChart');
            if (revenueCtx) {
                new Chart(revenueCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Premium', 'Socios', 'Enterprise', 'Publicidad'],
                        datasets: [{
                            data: [35, 40, 20, 5],
                            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { color: '#ffffff', padding: 20 }
                            }
                        }
                    }
                });
            }
            
            // Growth Chart
            const growthCtx = document.getElementById('growthChart');
            if (growthCtx) {
                new Chart(growthCtx, {
                    type: 'line',
                    data: {
                        labels: ['Año 1', 'Año 2', 'Año 3'],
                        datasets: [{
                            label: 'Usuarios (K)',
                            data: [50, 200, 500],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.4
                        }, {
                            label: 'Ingresos ($M)',
                            data: [1.5, 6, 15],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { 
                            legend: { 
                                labels: { color: '#ffffff' }
                            }
                        },
                        scales: {
                            y: { 
                                beginAtZero: true,
                                ticks: { color: '#ffffff' },
                                grid: { color: '#374151' }
                            },
                            x: { 
                                ticks: { color: '#ffffff' },
                                grid: { color: '#374151' }
                            }
                        }
                    }
                });
            }
        }
        
        showSlide(0);
        setTimeout(initCharts, 500);
    </script>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, 'pitch-presentation.html'), html);
    console.log('✅ Presentación HTML generada: pitch-presentation.html');
  }

  renderSlide(slide) {
    const bgColor = slide.content.colors ? slide.content.colors[1] : '#1f2937';
    const textColor = slide.content.colors ? slide.content.colors[0] : '#ffffff';
    
    switch (slide.type) {
      case 'cover':
        return `
        <div class="slide hidden flex items-center justify-center relative" style="background: linear-gradient(135deg, ${bgColor}, ${textColor})">
            <div class="absolute inset-0 opacity-20">
                <img src="media/hero-background.svg" alt="Hero" class="w-full h-full object-cover"/>
            </div>
            <div class="relative z-10 text-center">
                <h1 class="text-6xl font-bold mb-4">${slide.title}</h1>
                <p class="text-2xl opacity-80">${slide.content.tagline}</p>
                <div class="mt-8 text-6xl">🚗 🛡️ 🤖</div>
            </div>
        </div>`;
        
      case 'problem':
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12 text-center">${slide.title}</h2>
            <div class="grid grid-cols-2 gap-12 items-center">
                <div class="flex justify-center">
                    <img src="media/problem-visual.svg" alt="Problem" class="max-w-full h-auto rounded-lg shadow-lg"/>
                </div>
                <div class="space-y-8 text-2xl">
                    ${slide.content.stats.map(stat => `
                        <div class="flex items-center gap-4">
                            <div class="w-6 h-6 bg-red-500 rounded-full"></div>
                            <span>${stat}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
        
      case 'solution':
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12">${slide.title}</h2>
            <div class="grid grid-cols-2 gap-12">
                <div class="space-y-6">
                    ${slide.content.features.map(feature => `
                        <div class="flex items-center gap-4 text-xl">
                            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>${feature}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="flex items-center justify-center">
                    <img src="media/app-mockup.svg" alt="App Mockup" class="max-w-sm h-auto rounded-3xl shadow-2xl"/>
                </div>
            </div>
        </div>`;
        
      case 'financials':
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12">${slide.title}</h2>
            <div class="grid grid-cols-2 gap-12">
                <div>
                    <h3 class="text-3xl font-bold mb-6">Costos vs Ingresos</h3>
                    <div class="chart-container">
                        <canvas id="financialChart"></canvas>
                    </div>
                </div>
                <div>
                    <h3 class="text-3xl font-bold mb-6">Métricas Clave</h3>
                    <div class="space-y-4">
                        <div class="text-2xl">Ingresos: <span class="text-green-400">${slide.content.revenue_projection}</span></div>
                        <div class="text-2xl">ROI: <span class="text-green-400">${slide.content.roi}</span></div>
                        <div class="text-xl">Breakeven: <span class="text-blue-400">Mes 6</span></div>
                    </div>
                </div>
            </div>
        </div>`;
        
      case 'cta':
        return `
        <section class="slide hidden" style="display:flex; align-items:center; justify-content:center; text-align:center">
            <div>
                <h1>Inversión Requerida</h1>
                <div class="title-underline" style="margin:0 auto"></div>
                
                <div style="font-size:72px; font-weight:700; color:var(--accent); margin:32px 0">
                    ${slide.content.ask}
                </div>
                
                <div style="font-size:20px; margin:24px 0; color:#a8b3c7">
                    ${slide.content.use.join(' • ')}
                </div>
                
                <div class="cta-section" style="margin-top:48px">
                    <p style="font-size:18px; margin-bottom:24px">
                        Únete al viaje para transformar la seguridad vial en México
                    </p>
                    <button class="btn" style="font-size:18px; padding:16px 32px">
                        Contactar Ahora
                    </button>
                    <div style="margin-top:16px; font-size:14px; color:#a8b3c7">
                        ${slide.content.contact}
                    </div>
                </div>
            </div>
        </section>`;
        
      case 'value':
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12">${slide.title}</h2>
            <div class="grid grid-cols-2 gap-8">
                ${slide.content.values.map((value, index) => `
                    <div class="flex items-center gap-6 text-xl mb-8 p-6 bg-gray-800 rounded-lg">
                        <img src="media/value-icon-${index + 1}.svg" alt="${value.text}" class="w-16 h-16"/>
                        <span>${value.text}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
        
      case 'market':
        return `
        <section class="slide hidden">
            <h1>${slide.title}</h1>
            <div class="title-underline"></div>
            
            <div class="grid-3">
                ${slide.content.segments.map(segment => `
                    <div class="card">
                        <div class="label">${segment.name}</div>
                        <div class="value">${segment.size}</div>
                        <div class="note">Mercado total disponible</div>
                        <div class="value" style="margin-top:12px; color:var(--accent)">${segment.revenue}</div>
                        <div class="note">Potencial de ingresos</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="total">
                <span class="pill">Total mercado potencial</span>
                <h2 style="margin:0">${slide.content.total_market}</h2>
            </div>
            
            <div class="note" style="text-align:center; margin-top:24px">
                Cifras basadas en análisis de mercado y proyecciones conservadoras
            </div>
        </section>`;
        
      case 'business':
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12">${slide.title}</h2>
            <div class="grid grid-cols-2 gap-12">
                <div class="chart-container">
                    <canvas id="revenueChart"></canvas>
                </div>
                <div class="space-y-4">
                    ${slide.content.streams.map(stream => `
                        <div class="p-4 bg-gray-800 rounded-lg">
                            <div class="text-xl font-bold">${stream.type}</div>
                            <div class="text-2xl text-green-400">${stream.price}</div>
                            <div class="text-sm text-gray-300">${stream.features}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
        
      case 'projections':
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12">${slide.title}</h2>
            <div class="grid grid-cols-2 gap-12">
                <div class="chart-container">
                    <canvas id="growthChart"></canvas>
                </div>
                <div class="space-y-6">
                    ${slide.content.milestones.map(milestone => `
                        <div class="p-4 bg-gray-800 rounded-lg">
                            <div class="text-2xl font-bold">${milestone.year}</div>
                            <div class="text-lg">${milestone.users} usuarios</div>
                            <div class="text-lg">${milestone.partners} socios</div>
                            <div class="text-xl text-green-400">${milestone.revenue}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
        
      case 'demo':
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12">${slide.title}</h2>
            <div class="grid grid-cols-2 gap-8">
                ${slide.content.screenshots.map(screenshot => `
                    <div class="bg-gray-800 rounded-lg p-4 text-center">
                        <div class="w-full h-64 bg-gray-700 rounded flex items-center justify-center mb-4">
                            <span class="text-4xl">📱</span>
                        </div>
                        <span class="text-lg">${screenshot.replace('.png', '').replace('-', ' ')}</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
        
      default:
        return `
        <div class="slide hidden p-16" style="background-color: ${bgColor}; color: ${textColor}">
            <h2 class="text-5xl font-bold mb-12">${slide.title}</h2>
            <div class="text-2xl">Contenido de ${slide.type}</div>
        </div>`;
    }
  }

  generateMarkdown() {
    let markdown = `# ${this.deck.title}\n\n`;
    
    this.deck.slides.forEach((slide, index) => {
      markdown += `## ${index + 1}. ${slide.title}\n\n`;
      
      if (slide.content.tagline) {
        markdown += `*${slide.content.tagline}*\n\n`;
      }
      
      if (slide.content.stats) {
        slide.content.stats.forEach(stat => {
          markdown += `- ❌ ${stat}\n`;
        });
        markdown += '\n';
      }
      
      if (slide.content.features) {
        slide.content.features.forEach(feature => {
          markdown += `- ✅ ${feature}\n`;
        });
        markdown += '\n';
      }
      
      markdown += '---\n\n';
    });
    
    fs.writeFileSync(path.join(__dirname, 'pitch-deck.md'), markdown);
    console.log('✅ Pitch deck en Markdown generado');
  }

  generatePowerPointScript() {
    const script = `
# Script para PowerPoint - ${this.deck.title}

## Instrucciones de diseño:
- Fuente: ${this.deck.design.font}
- Color primario: ${this.deck.design.primary_color}
- Color secundario: ${this.deck.design.secondary_color}

## Diapositivas:

${this.deck.slides.map((slide, index) => `
### Diapositiva ${index + 1}: ${slide.title}
- Tipo: ${slide.type}
- Colores sugeridos: ${slide.content.colors ? slide.content.colors.join(', ') : 'Por defecto'}
- Contenido: ${JSON.stringify(slide.content, null, 2)}
`).join('\n')}
    `;
    
    fs.writeFileSync(path.join(__dirname, 'powerpoint-script.txt'), script);
    console.log('✅ Script para PowerPoint generado');
  }
}

// Ejecutar generador
if (require.main === module) {
  const generator = new PitchGenerator();
  generator.generateHTML();
  generator.generateMarkdown();
  generator.generatePowerPointScript();
  
  console.log('\n🎯 Pitch deck completo generado:');
  console.log('📄 pitch-presentation.html - Presentación interactiva');
  console.log('📝 pitch-deck.md - Formato Markdown');
  console.log('🎨 powerpoint-script.txt - Guía para PowerPoint');
}