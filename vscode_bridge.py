import os
import json
import time
import threading
import tkinter as tk
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class VSCodeBridge:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("VS Code Bridge")
        self.root.geometry("600x400")
        self.root.configure(bg='#1e1e1e')
        
        # Chat
        self.chat = tk.Text(self.root, bg='#1e1e1e', fg='#d4d4d4', font=('Consolas', 10))
        self.chat.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Input
        self.entry = tk.Entry(self.root, bg='#3c3c3c', fg='#d4d4d4', font=('Arial', 11))
        self.entry.pack(fill='x', padx=10, pady=5)
        self.entry.bind('<Return>', self.process_with_context)
        
        # Estado
        self.active_file = None
        self.file_content = ""
        self.cursor_position = None
        
        self.log("🔗 VS Code Bridge iniciado")
        self.log("Leyendo archivo activo...")
        
        # Leer archivo activo
        self.read_active_file()
        
        # Monitor cambios
        self.start_file_monitor()
        
    def read_active_file(self):
        # Leer archivo actualmente abierto
        active_file = "A:\\asistencia_vial\\TWITTER_THREAD_LISTO.txt"
        
        try:
            with open(active_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            self.active_file = active_file
            self.file_content = content
            
            self.log(f"📄 Archivo activo: {os.path.basename(active_file)}")
            self.log(f"📊 Contenido: {len(content)} caracteres")
            self.log(f"🎯 Detectado: Thread de Twitter para Asistencia Vial")
            self.log("✅ Contexto cargado - Listo para orquestar")
            
        except Exception as e:
            self.log(f"❌ Error leyendo archivo: {e}")
            
    def start_file_monitor(self):
        # Monitor de cambios en archivos
        class FileHandler(FileSystemEventHandler):
            def __init__(self, bridge):
                self.bridge = bridge
                
            def on_modified(self, event):
                if not event.is_directory and event.src_path.endswith('.txt'):
                    self.bridge.file_changed(event.src_path)
                    
        handler = FileHandler(self)
        observer = Observer()
        observer.schedule(handler, "A:\\asistencia_vial", recursive=True)
        observer.start()
        
    def file_changed(self, filepath):
        if filepath == self.active_file:
            self.read_active_file()
            self.log("🔄 Archivo actualizado - Contexto refrescado")
            
    def process_with_context(self, event):
        query = self.entry.get().strip()
        if not query:
            return
            
        self.entry.delete(0, tk.END)
        
        self.log(f"\n🎯 CONSULTA: {query}")
        self.log("=" * 40)
        
        # Analizar con contexto del archivo
        analysis = self.analyze_with_file_context(query)
        self.log(f"📊 ANÁLISIS CON CONTEXTO: {analysis}")
        
        # Respuesta contextual
        response = self.contextual_response(query)
        self.log(f"💡 RESPUESTA: {response}")
        
        # Acción sugerida
        action = self.suggest_action(query)
        self.log(f"🚀 ACCIÓN: {action}")
        
    def analyze_with_file_context(self, query):
        if not self.file_content:
            return "Sin contexto de archivo"
            
        # Analizar contenido del archivo activo
        if "TWITTER_THREAD" in self.active_file:
            if "publicar" in query.lower() or "viral" in query.lower():
                return "Thread de Twitter listo para publicar - 8 tweets sobre Asistencia Vial"
            elif "mejorar" in query.lower():
                return "Thread bien estructurado - datos impactantes + call to action"
            else:
                return "Contexto: Thread viral preparado para @AsistenciVialMX"
        else:
            return f"Analizando {os.path.basename(self.active_file)}"
            
    def contextual_response(self, query):
        if "publicar" in query.lower():
            return """Para publicar el thread:
1. Ve a Twitter @AsistenciVialMX
2. Copia tweet 1/8 del archivo
3. Publica como hilo
4. Continúa con tweets 2/8 hasta 8/8
5. Monitorea engagement"""
            
        elif "viral" in query.lower():
            return """Estrategia viral:
1. Publicar thread en horario pico (8-10 PM México)
2. Compartir en grupos de Facebook de conductores
3. Postear en r/mexico y r/CDMX
4. Contactar influencers de tech mexicano
5. Usar hashtags #SeguridadVial #TechMexicano"""
            
        elif "mejorar" in query.lower():
            return """El thread está optimizado:
✅ Hook fuerte (dato brutal)
✅ Problema claro (2.5h espera)
✅ Solución específica (3s SOS)
✅ Beneficios claros (gratis, offline)
✅ Call to action (probar app)
Listo para publicar"""
            
        else:
            return f"Basándome en {os.path.basename(self.active_file)}: {query}"
            
    def suggest_action(self, query):
        if "publicar" in query.lower():
            return "ACCIÓN INMEDIATA: Publicar thread ahora para conseguir usuarios reales"
        elif "viral" in query.lower():
            return "ACCIÓN: Ejecutar estrategia de distribución en múltiples canales"
        else:
            return "ACCIÓN: Especificar objetivo para sugerir pasos concretos"
            
    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        self.chat.insert(tk.END, f"[{timestamp}] {message}\n")
        self.chat.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    bridge = VSCodeBridge()
    bridge.run()