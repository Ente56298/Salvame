import os
import json
from collections import defaultdict, Counter
from datetime import datetime
import tkinter as tk
from tkinter import scrolledtext, ttk
import threading

class EcosystemMapper:
    def __init__(self):
        self.projects = {}
        self.file_stats = defaultdict(int)
        self.project_patterns = {
            'web_project': ['package.json', 'index.html', 'src/', 'public/'],
            'python_project': ['requirements.txt', 'setup.py', '__init__.py', 'main.py'],
            'documentation': ['README.md', 'docs/', '*.md'],
            'cora_project': ['cora', 'CO•RA', 'singularidad'],
            'tenancingo': ['tenancingo', 'apuestas', 'streaming'],
            'asistencia_vial': ['asistencia', 'vial', 'sos', 'emergencia']
        }
        
        self.setup_ui()
        
    def setup_ui(self):
        self.root = tk.Tk()
        self.root.title("🗺️ Mapeador de Ecosistema Completo")
        self.root.geometry("1200x800")
        self.root.configure(bg='#0d1117')
        
        # Frame superior - controles
        control_frame = tk.Frame(self.root, bg='#21262d')
        control_frame.pack(fill='x', padx=10, pady=5)
        
        tk.Button(control_frame, text="🗺️ Mapear Unidad A:\\", 
                 bg='#238636', fg='white', command=self.map_drive_a).pack(side='left', padx=5)
        
        tk.Button(control_frame, text="🔍 Detectar Proyectos", 
                 bg='#1f6feb', fg='white', command=self.detect_projects).pack(side='left', padx=5)
        
        tk.Button(control_frame, text="📊 Generar Reporte", 
                 bg='#8b5cf6', fg='white', command=self.generate_report).pack(side='left', padx=5)
        
        # Progress bar
        self.progress = ttk.Progressbar(control_frame, mode='indeterminate')
        self.progress.pack(side='right', padx=10)
        
        # Notebook para tabs
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Tab 1: Análisis en tiempo real
        self.analysis_tab = scrolledtext.ScrolledText(
            self.notebook, bg='#0d1117', fg='#c9d1d9', 
            font=('Consolas', 10), wrap=tk.WORD
        )
        self.notebook.add(self.analysis_tab, text="📊 Análisis")
        
        # Tab 2: Proyectos detectados
        self.projects_tab = scrolledtext.ScrolledText(
            self.notebook, bg='#0d1117', fg='#c9d1d9', 
            font=('Consolas', 10), wrap=tk.WORD
        )
        self.notebook.add(self.projects_tab, text="🚀 Proyectos")
        
        # Tab 3: Estadísticas
        self.stats_tab = scrolledtext.ScrolledText(
            self.notebook, bg='#0d1117', fg='#c9d1d9', 
            font=('Consolas', 10), wrap=tk.WORD
        )
        self.notebook.add(self.stats_tab, text="📈 Estadísticas")
        
        self.log_analysis("🗺️ Mapeador de Ecosistema iniciado")
        self.log_analysis("Listo para analizar unidades y detectar proyectos")
        
    def map_drive_a(self):
        self.log_analysis("🔍 Iniciando mapeo completo de unidad A:\\")
        self.progress.start()
        threading.Thread(target=self._map_drive_thread, daemon=True).start()
        
    def _map_drive_thread(self):
        drive_path = "A:\\"
        total_files = 0
        total_dirs = 0
        
        try:
            for root, dirs, files in os.walk(drive_path):
                # Filtrar directorios comunes que no son proyectos
                dirs[:] = [d for d in dirs if not d.startswith('.') and 
                          d not in ['node_modules', '__pycache__', 'venv', '.git']]
                
                total_dirs += len(dirs)
                total_files += len(files)
                
                # Analizar archivos por extensión
                for file in files:
                    ext = os.path.splitext(file)[1].lower()
                    self.file_stats[ext] += 1
                    
                # Detectar si es un directorio de proyecto
                if self.is_project_directory(root, dirs, files):
                    project_type = self.classify_project(root, dirs, files)
                    self.projects[root] = {
                        'type': project_type,
                        'files': len(files),
                        'subdirs': len(dirs),
                        'size_estimate': self.estimate_directory_size(root),
                        'last_modified': self.get_last_modified(root)
                    }
                    
                # Actualizar progreso cada 1000 directorios
                if total_dirs % 1000 == 0:
                    self.log_analysis(f"📊 Procesados: {total_dirs:,} directorios, {total_files:,} archivos")
                    
        except Exception as e:
            self.log_analysis(f"❌ Error: {str(e)}")
            
        self.progress.stop()
        self.log_analysis(f"✅ Mapeo completado: {total_dirs:,} directorios, {total_files:,} archivos")
        self.log_analysis(f"🚀 Proyectos detectados: {len(self.projects)}")
        
        # Auto-detectar proyectos
        self.detect_projects()
        
    def is_project_directory(self, path, dirs, files):
        # Criterios para considerar un directorio como proyecto
        indicators = 0
        
        # Archivos de configuración
        config_files = ['package.json', 'requirements.txt', 'setup.py', 'Cargo.toml', 
                       'pom.xml', 'build.gradle', 'composer.json']
        if any(f in files for f in config_files):
            indicators += 2
            
        # Estructura de código
        code_dirs = ['src', 'lib', 'app', 'components', 'modules']
        if any(d in dirs for d in code_dirs):
            indicators += 1
            
        # Archivos de código
        code_extensions = ['.py', '.js', '.ts', '.java', '.cpp', '.cs', '.php']
        code_files = sum(1 for f in files if any(f.endswith(ext) for ext in code_extensions))
        if code_files > 5:
            indicators += 1
            
        # Documentación
        if 'README.md' in files or any(f.endswith('.md') for f in files):
            indicators += 1
            
        return indicators >= 2
        
    def classify_project(self, path, dirs, files):
        path_lower = path.lower()
        
        # Clasificación por patrones específicos
        for project_type, patterns in self.project_patterns.items():
            for pattern in patterns:
                if pattern in path_lower or any(pattern in f.lower() for f in files):
                    return project_type
                    
        # Clasificación por tecnología
        if 'package.json' in files:
            return 'web_project'
        elif any(f.endswith('.py') for f in files):
            return 'python_project'
        elif any(f.endswith('.md') for f in files) and len([f for f in files if f.endswith('.md')]) > 3:
            return 'documentation'
        else:
            return 'unknown_project'
            
    def estimate_directory_size(self, path):
        try:
            total_size = 0
            for dirpath, dirnames, filenames in os.walk(path):
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    try:
                        total_size += os.path.getsize(filepath)
                    except:
                        continue
                # Limitar análisis para directorios muy grandes
                if total_size > 100 * 1024 * 1024:  # 100MB
                    return f">{total_size // (1024*1024)}MB"
            return f"{total_size // (1024*1024)}MB" if total_size > 1024*1024 else f"{total_size // 1024}KB"
        except:
            return "Unknown"
            
    def get_last_modified(self, path):
        try:
            return datetime.fromtimestamp(os.path.getmtime(path)).strftime('%Y-%m-%d')
        except:
            return "Unknown"
            
    def detect_projects(self):
        if not self.projects:
            self.log_projects("⚠️ No hay datos de mapeo. Ejecuta 'Mapear Unidad A:\\' primero.")
            return
            
        self.log_projects("🚀 PROYECTOS DETECTADOS EN ECOSISTEMA")
        self.log_projects("=" * 60)
        
        # Agrupar por tipo
        by_type = defaultdict(list)
        for path, info in self.projects.items():
            by_type[info['type']].append((path, info))
            
        # Mostrar por categorías
        priority_types = ['cora_project', 'tenancingo', 'asistencia_vial', 'web_project', 'python_project']
        
        for project_type in priority_types:
            if project_type in by_type:
                self.log_projects(f"\n🎯 {project_type.upper().replace('_', ' ')}")
                self.log_projects("-" * 40)
                
                for path, info in sorted(by_type[project_type], key=lambda x: x[1]['last_modified'], reverse=True):
                    project_name = os.path.basename(path)
                    self.log_projects(f"📁 {project_name}")
                    self.log_projects(f"   📍 {path}")
                    self.log_projects(f"   📊 {info['files']} archivos, {info['size_estimate']}")
                    self.log_projects(f"   📅 Modificado: {info['last_modified']}")
                    self.log_projects("")
                    
        # Mostrar otros tipos
        other_types = [t for t in by_type.keys() if t not in priority_types]
        if other_types:
            self.log_projects(f"\n📂 OTROS PROYECTOS ({len(other_types)} tipos)")
            for project_type in other_types:
                self.log_projects(f"   {project_type}: {len(by_type[project_type])} proyectos")
                
    def generate_report(self):
        if not self.projects:
            self.log_stats("⚠️ No hay datos para generar reporte.")
            return
            
        # Generar estadísticas
        self.log_stats("📊 ESTADÍSTICAS DEL ECOSISTEMA")
        self.log_stats("=" * 50)
        
        # Estadísticas generales
        total_projects = len(self.projects)
        total_files = sum(info['files'] for info in self.projects.values())
        
        self.log_stats(f"🎯 RESUMEN GENERAL:")
        self.log_stats(f"   • Proyectos detectados: {total_projects:,}")
        self.log_stats(f"   • Archivos en proyectos: {total_files:,}")
        
        # Top extensiones
        self.log_stats(f"\n📄 TOP EXTENSIONES DE ARCHIVO:")
        top_extensions = Counter(self.file_stats).most_common(10)
        for ext, count in top_extensions:
            percentage = (count / sum(self.file_stats.values())) * 100
            self.log_stats(f"   {ext or 'sin ext'}: {count:,} ({percentage:.1f}%)")
            
        # Proyectos por tipo
        type_counts = Counter(info['type'] for info in self.projects.values())
        self.log_stats(f"\n🚀 PROYECTOS POR TIPO:")
        for ptype, count in type_counts.most_common():
            self.log_stats(f"   {ptype.replace('_', ' ').title()}: {count}")
            
        # Generar archivo de reporte
        self.save_report_to_file()
        
    def save_report_to_file(self):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        report_path = f"A:\\ECOSYSTEM_REPORT_{timestamp}.md"
        
        try:
            with open(report_path, 'w', encoding='utf-8') as f:
                f.write(f"# 🗺️ REPORTE ECOSISTEMA COMPLETO\n")
                f.write(f"**Generado**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                
                f.write(f"## 📊 MÉTRICAS GENERALES\n")
                f.write(f"- **Proyectos detectados**: {len(self.projects):,}\n")
                f.write(f"- **Archivos totales**: {sum(self.file_stats.values()):,}\n")
                f.write(f"- **Tipos de archivo**: {len(self.file_stats)}\n\n")
                
                f.write(f"## 🚀 PROYECTOS POR CATEGORÍA\n")
                by_type = defaultdict(list)
                for path, info in self.projects.items():
                    by_type[info['type']].append((path, info))
                    
                for ptype, projects in by_type.items():
                    f.write(f"\n### {ptype.upper().replace('_', ' ')}\n")
                    for path, info in projects:
                        f.write(f"- **{os.path.basename(path)}**\n")
                        f.write(f"  - Ruta: `{path}`\n")
                        f.write(f"  - Archivos: {info['files']}\n")
                        f.write(f"  - Tamaño: {info['size_estimate']}\n")
                        f.write(f"  - Modificado: {info['last_modified']}\n\n")
                        
            self.log_stats(f"💾 Reporte guardado: {report_path}")
            
        except Exception as e:
            self.log_stats(f"❌ Error guardando reporte: {str(e)}")
            
    def log_analysis(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.analysis_tab.insert(tk.END, f"[{timestamp}] {message}\n")
        self.analysis_tab.see(tk.END)
        self.root.update()
        
    def log_projects(self, message):
        self.projects_tab.insert(tk.END, f"{message}\n")
        self.projects_tab.see(tk.END)
        self.root.update()
        
    def log_stats(self, message):
        self.stats_tab.insert(tk.END, f"{message}\n")
        self.stats_tab.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    mapper = EcosystemMapper()
    mapper.run()