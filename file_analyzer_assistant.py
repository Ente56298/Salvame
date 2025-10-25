import os
import json
import re
from datetime import datetime, timedelta
from collections import defaultdict
import tkinter as tk
from tkinter import scrolledtext, filedialog
import threading

class FileAnalyzerAssistant:
    def __init__(self):
        self.analyzed_files = {}
        self.insights = defaultdict(list)
        self.patterns = {
            'dates': r'\d{4}-\d{2}-\d{2}',
            'money': r'\$[\d,]+',
            'status': r'(completado|pendiente|activo|funcionando)',
            'priorities': r'(urgente|crítico|importante|prioridad)',
            'metrics': r'(\d+[KM]?\+?\s*(archivos|usuarios|proyectos))'
        }
        
        self.setup_ui()
        
    def setup_ui(self):
        self.root = tk.Tk()
        self.root.title("📁 Analizador de Archivos Inteligente")
        self.root.geometry("1000x700")
        self.root.configure(bg='#0d1117')
        
        # Frame superior - controles
        control_frame = tk.Frame(self.root, bg='#21262d')
        control_frame.pack(fill='x', padx=10, pady=5)
        
        tk.Button(control_frame, text="📁 Analizar Directorio", 
                 bg='#238636', fg='white', command=self.analyze_directory).pack(side='left', padx=5)
        
        tk.Button(control_frame, text="📄 Analizar Archivo", 
                 bg='#1f6feb', fg='white', command=self.analyze_file).pack(side='left', padx=5)
        
        tk.Button(control_frame, text="🧠 Generar Insights", 
                 bg='#8b5cf6', fg='white', command=self.generate_insights).pack(side='left', padx=5)
        
        # Área de resultados
        self.results_area = scrolledtext.ScrolledText(
            self.root, bg='#0d1117', fg='#c9d1d9', 
            font=('Consolas', 10), wrap=tk.WORD
        )
        self.results_area.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Input para consultas
        self.query_entry = tk.Entry(
            self.root, bg='#21262d', fg='#c9d1d9', 
            font=('Arial', 11), insertbackground='#c9d1d9'
        )
        self.query_entry.pack(fill='x', padx=10, pady=5)
        self.query_entry.bind('<Return>', self.process_query)
        
        self.log("📁 Analizador de Archivos Inteligente iniciado")
        self.log("Analiza archivos .md, .txt, .py, .json para insights personalizados")
        
    def analyze_directory(self):
        directory = filedialog.askdirectory(title="Seleccionar directorio a analizar")
        if directory:
            self.log(f"🔍 Analizando directorio: {directory}")
            threading.Thread(target=self._analyze_directory_thread, args=(directory,), daemon=True).start()
            
    def _analyze_directory_thread(self, directory):
        file_count = 0
        insights_found = 0
        
        for root, dirs, files in os.walk(directory):
            # Ignorar directorios comunes
            dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '__pycache__', '.vscode']]
            
            for file in files:
                if file.endswith(('.md', '.txt', '.py', '.json')):
                    file_path = os.path.join(root, file)
                    try:
                        insights = self.analyze_file_content(file_path)
                        if insights:
                            self.analyzed_files[file_path] = insights
                            insights_found += len(insights)
                        file_count += 1
                        
                        if file_count % 100 == 0:
                            self.log(f"📊 Procesados: {file_count} archivos, {insights_found} insights")
                            
                    except Exception as e:
                        continue
                        
        self.log(f"✅ Análisis completado: {file_count} archivos, {insights_found} insights totales")
        self.generate_summary()
        
    def analyze_file(self):
        file_path = filedialog.askopenfilename(
            title="Seleccionar archivo",
            filetypes=[("Archivos soportados", "*.md *.txt *.py *.json"), ("Todos", "*.*")]
        )
        if file_path:
            insights = self.analyze_file_content(file_path)
            self.display_file_insights(file_path, insights)
            
    def analyze_file_content(self, file_path):
        insights = []
        
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # Análisis por patrones
            for pattern_name, pattern in self.patterns.items():
                matches = re.findall(pattern, content, re.IGNORECASE)
                if matches:
                    insights.append({
                        'type': pattern_name,
                        'matches': matches,
                        'count': len(matches)
                    })
                    
            # Análisis específico por tipo de archivo
            if file_path.endswith('.md'):
                insights.extend(self.analyze_markdown(content))
            elif file_path.endswith('.py'):
                insights.extend(self.analyze_python(content))
            elif file_path.endswith('.json'):
                insights.extend(self.analyze_json(content))
                
        except Exception as e:
            insights.append({'type': 'error', 'message': str(e)})
            
        return insights
        
    def analyze_markdown(self, content):
        insights = []
        
        # Buscar títulos y estructura
        headers = re.findall(r'^#+\s+(.+)$', content, re.MULTILINE)
        if headers:
            insights.append({'type': 'structure', 'headers': headers[:5]})
            
        # Buscar checkboxes y tareas
        tasks = re.findall(r'- \[([ x])\] (.+)', content)
        if tasks:
            completed = len([t for t in tasks if t[0] == 'x'])
            total = len(tasks)
            insights.append({'type': 'tasks', 'completed': completed, 'total': total})
            
        # Buscar URLs
        urls = re.findall(r'https?://[^\s\)]+', content)
        if urls:
            insights.append({'type': 'urls', 'count': len(urls), 'samples': urls[:3]})
            
        return insights
        
    def analyze_python(self, content):
        insights = []
        
        # Buscar funciones y clases
        functions = re.findall(r'^def\s+(\w+)', content, re.MULTILINE)
        classes = re.findall(r'^class\s+(\w+)', content, re.MULTILINE)
        
        if functions:
            insights.append({'type': 'functions', 'count': len(functions), 'names': functions[:5]})
        if classes:
            insights.append({'type': 'classes', 'count': len(classes), 'names': classes})
            
        # Buscar imports
        imports = re.findall(r'^(?:from\s+\w+\s+)?import\s+(.+)$', content, re.MULTILINE)
        if imports:
            insights.append({'type': 'imports', 'count': len(imports)})
            
        return insights
        
    def analyze_json(self, content):
        insights = []
        
        try:
            data = json.loads(content)
            insights.append({'type': 'json_structure', 'keys': list(data.keys())[:10] if isinstance(data, dict) else 'array'})
        except:
            insights.append({'type': 'json_error', 'message': 'Invalid JSON'})
            
        return insights
        
    def display_file_insights(self, file_path, insights):
        self.log(f"📄 Análisis de: {os.path.basename(file_path)}")
        self.log("-" * 50)
        
        for insight in insights:
            if insight['type'] == 'dates':
                self.log(f"📅 Fechas encontradas: {insight['count']} ({', '.join(insight['matches'][:3])})")
            elif insight['type'] == 'money':
                self.log(f"💰 Valores monetarios: {', '.join(insight['matches'])}")
            elif insight['type'] == 'status':
                self.log(f"📊 Estados: {', '.join(set(insight['matches']))}")
            elif insight['type'] == 'tasks':
                completion = (insight['completed'] / insight['total']) * 100
                self.log(f"✅ Tareas: {insight['completed']}/{insight['total']} ({completion:.1f}% completado)")
            elif insight['type'] == 'functions':
                self.log(f"🔧 Funciones: {insight['count']} ({', '.join(insight['names'])})")
                
        self.log("")
        
    def generate_insights(self):
        if not self.analyzed_files:
            self.log("⚠️ No hay archivos analizados. Analiza un directorio primero.")
            return
            
        self.log("🧠 GENERANDO INSIGHTS INTELIGENTES")
        self.log("=" * 60)
        
        # Análisis de patrones globales
        all_dates = []
        all_money = []
        all_status = []
        
        for file_path, insights in self.analyzed_files.items():
            for insight in insights:
                if insight['type'] == 'dates':
                    all_dates.extend(insight['matches'])
                elif insight['type'] == 'money':
                    all_money.extend(insight['matches'])
                elif insight['type'] == 'status':
                    all_status.extend(insight['matches'])
                    
        # Insights temporales
        if all_dates:
            recent_dates = [d for d in all_dates if d >= '2024-01-01']
            self.log(f"📅 ANÁLISIS TEMPORAL:")
            self.log(f"   • Fechas totales: {len(all_dates)}")
            self.log(f"   • Fechas recientes (2024+): {len(recent_dates)}")
            self.log(f"   • Fecha más reciente: {max(all_dates)}")
            
        # Insights financieros
        if all_money:
            self.log(f"💰 ANÁLISIS FINANCIERO:")
            self.log(f"   • Referencias monetarias: {len(all_money)}")
            self.log(f"   • Valores únicos: {len(set(all_money))}")
            
        # Insights de estado
        if all_status:
            status_count = defaultdict(int)
            for status in all_status:
                status_count[status.lower()] += 1
            self.log(f"📊 ANÁLISIS DE ESTADOS:")
            for status, count in sorted(status_count.items(), key=lambda x: x[1], reverse=True):
                self.log(f"   • {status}: {count} menciones")
                
        # Recomendaciones
        self.generate_recommendations()
        
    def generate_recommendations(self):
        self.log("\n🎯 RECOMENDACIONES INTELIGENTES:")
        
        # Análisis de archivos por tipo
        md_files = [f for f in self.analyzed_files.keys() if f.endswith('.md')]
        py_files = [f for f in self.analyzed_files.keys() if f.endswith('.py')]
        
        if len(md_files) > 100:
            self.log(f"📚 Tienes {len(md_files)} archivos MD - considera consolidar documentación")
            
        if len(py_files) > 50:
            self.log(f"🐍 Tienes {len(py_files)} scripts Python - oportunidad de crear framework")
            
        # Buscar patrones de urgencia
        urgent_files = []
        for file_path, insights in self.analyzed_files.items():
            for insight in insights:
                if insight['type'] == 'priorities' and any('urgente' in str(m).lower() for m in insight['matches']):
                    urgent_files.append(file_path)
                    
        if urgent_files:
            self.log(f"🚨 {len(urgent_files)} archivos contienen elementos urgentes")
            
    def generate_summary(self):
        total_files = len(self.analyzed_files)
        total_insights = sum(len(insights) for insights in self.analyzed_files.values())
        
        self.log(f"\n📊 RESUMEN DEL ANÁLISIS:")
        self.log(f"   • Archivos analizados: {total_files}")
        self.log(f"   • Insights generados: {total_insights}")
        self.log(f"   • Promedio insights/archivo: {total_insights/total_files:.1f}")
        
    def process_query(self, event):
        query = self.query_entry.get().strip()
        if not query:
            return
            
        self.query_entry.delete(0, tk.END)
        self.log(f"❓ Consulta: {query}")
        
        # Buscar en archivos analizados
        results = []
        query_lower = query.lower()
        
        for file_path, insights in self.analyzed_files.items():
            if query_lower in file_path.lower():
                results.append(f"📄 {os.path.basename(file_path)}")
                
        if results:
            self.log("🔍 Archivos relacionados:")
            for result in results[:10]:
                self.log(f"   {result}")
        else:
            self.log("❌ No se encontraron archivos relacionados")
            
        self.log("")
        
    def log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.results_area.insert(tk.END, f"[{timestamp}] {message}\n")
        self.results_area.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    assistant = FileAnalyzerAssistant()
    assistant.run()