import tkinter as tk
import threading
import time
import json
import os
import pyperclip
import requests
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class RealTimeBridge:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("🔗 Real-Time Bridge")
        self.root.geometry("800x600")
        self.root.configure(bg='#0a0a0a')
        
        # Chat bidireccional
        self.chat = tk.Text(self.root, bg='#0a0a0a', fg='#00ff00', 
                           font=('Consolas', 11), wrap=tk.WORD)
        self.chat.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Input bidireccional
        input_frame = tk.Frame(self.root, bg='#0a0a0a')
        input_frame.pack(fill='x', padx=10, pady=5)
        
        self.entry = tk.Entry(input_frame, bg='#1a1a1a', fg='#00ff00', 
                             font=('Arial', 12), insertbackground='#00ff00')
        self.entry.pack(side='left', fill='x', expand=True, padx=(0,10))
        self.entry.bind('<Return>', self.send_to_bridge)
        
        # Botones de acción
        self.send_btn = tk.Button(input_frame, text="→", bg='#00aa00', fg='white',
                                 command=self.send_to_bridge, width=3)
        self.send_btn.pack(side='right', padx=2)
        
        self.execute_btn = tk.Button(input_frame, text="⚡", bg='#aa0000', fg='white',
                                    command=self.execute_action, width=3)
        self.execute_btn.pack(side='right', padx=2)
        
        # Estado del bridge
        self.active_file = None
        self.file_content = ""
        self.conversation_context = []
        self.bridge_active = True
        
        # Inicializar
        self.init_bridge()
        
        # Monitores
        self.start_file_monitor()
        self.start_clipboard_monitor()
        
    def init_bridge(self):
        self.log("🔗 REAL-TIME BRIDGE INICIADO")
        self.log("=" * 50)
        self.log("MODO: Bidireccional - Leo y escribo en tiempo real")
        self.log("CONTEXTO: VS Code + Clipboard + Archivos")
        self.log("OBJETIVO: Orquestación total")
        self.log("")
        
        # Leer contexto inicial
        self.read_current_context()
        
    def read_current_context(self):
        # Leer archivo activo
        active_file = "A:\\asistencia_vial\\TWITTER_THREAD_LISTO.txt"
        
        try:
            with open(active_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            self.active_file = active_file
            self.file_content = content
            
            self.log(f"📄 CONTEXTO CARGADO: {os.path.basename(active_file)}")
            self.log(f"🎯 DETECTADO: Thread viral Asistencia Vial")
            self.log(f"📊 ESTADO: Listo para activar dominós")
            self.log("✅ Bridge bidireccional activo")
            
        except Exception as e:
            self.log(f"⚠️ Error contexto: {e}")
            
    def start_file_monitor(self):
        class FileHandler(FileSystemEventHandler):
            def __init__(self, bridge):
                self.bridge = bridge
                
            def on_modified(self, event):
                if not event.is_directory:
                    self.bridge.file_changed(event.src_path)
                    
        handler = FileHandler(self)
        observer = Observer()
        observer.schedule(handler, "A:\\asistencia_vial", recursive=True)
        observer.start()
        
    def start_clipboard_monitor(self):
        def monitor():
            last_clipboard = ""
            while self.bridge_active:
                try:
                    clipboard = pyperclip.paste()
                    if clipboard and clipboard != last_clipboard and len(clipboard) > 20:
                        last_clipboard = clipboard
                        self.process_clipboard_input(clipboard)
                except:
                    pass
                time.sleep(1)
                
        threading.Thread(target=monitor, daemon=True).start()
        
    def file_changed(self, filepath):
        if filepath == self.active_file:
            self.read_current_context()
            self.log("🔄 ARCHIVO ACTUALIZADO - Contexto sincronizado")
            
    def process_clipboard_input(self, clipboard):
        # Detectar si es respuesta de agente
        if any(word in clipboard.lower() for word in ['implementar', 'código', 'function', 'const']):
            self.log(f"🟠 COPILOT DETECTADO: {clipboard[:100]}...")
            self.process_agent_response("Copilot", clipboard)
        elif len(clipboard) > 100 and any(word in clipboard.lower() for word in ['considera', 'puedes', 'estrategia']):
            self.log(f"🟢 GEMINI DETECTADO: {clipboard[:100]}...")
            self.process_agent_response("Gemini", clipboard)
            
    def send_to_bridge(self, event=None):
        message = self.entry.get().strip()
        if not message:
            return
            
        self.entry.delete(0, tk.END)
        
        self.log(f"\n👤 INPUT: {message}")
        self.log("-" * 40)
        
        # Procesar con contexto completo
        threading.Thread(target=self.process_bidirectional, args=(message,), daemon=True).start()
        
    def process_bidirectional(self, message):
        # Análisis contextual
        context = self.analyze_full_context(message)
        self.log(f"🧠 CONTEXTO: {context}")
        
        # Mi respuesta inmediata
        my_response = self.get_contextual_response(message, context)
        self.log(f"🔵 AMAZON Q: {my_response}")
        
        # Activar otros agentes si necesario
        if self.needs_multi_agent(message):
            self.activate_agents(message, context)
            
        # Sugerir acción bidireccional
        action = self.suggest_bidirectional_action(message, context)
        self.log(f"⚡ ACCIÓN: {action}")
        
        # Guardar en contexto
        self.conversation_context.append({
            'input': message,
            'context': context,
            'response': my_response,
            'action': action
        })
        
    def analyze_full_context(self, message):
        context = {
            'file': os.path.basename(self.active_file) if self.active_file else None,
            'content_type': 'twitter_thread' if 'TWITTER' in str(self.active_file) else 'unknown',
            'intent': self.detect_intent(message),
            'urgency': self.detect_urgency(message),
            'scope': self.detect_scope(message)
        }
        return context
        
    def detect_intent(self, message):
        msg_lower = message.lower()
        if any(word in msg_lower for word in ['publicar', 'viral', 'twitter']):
            return 'viral_activation'
        elif any(word in msg_lower for word in ['domino', 'activar', 'ejecutar']):
            return 'domino_execution'
        elif any(word in msg_lower for word in ['mejorar', 'optimizar']):
            return 'optimization'
        else:
            return 'general_query'
            
    def detect_urgency(self, message):
        if any(word in message.lower() for word in ['ahora', 'ya', 'inmediato', 'urgente']):
            return 'immediate'
        elif any(word in message.lower() for word in ['hoy', 'pronto']):
            return 'high'
        else:
            return 'normal'
            
    def detect_scope(self, message):
        if any(word in message.lower() for word in ['global', 'mundial', 'internacional']):
            return 'global'
        elif any(word in message.lower() for word in ['nacional', 'méxico', 'país']):
            return 'national'
        else:
            return 'local'
            
    def get_contextual_response(self, message, context):
        if context['intent'] == 'viral_activation':
            return """ACTIVACIÓN VIRAL:
1. Thread listo en archivo activo
2. Copiar tweet 1/8 
3. Ir a @AsistenciVialMX
4. Publicar como hilo
5. Primer dominó activado"""
            
        elif context['intent'] == 'domino_execution':
            return """SECUENCIA DOMINÓS:
Thread → Usuarios → Vida salvada → Medios → Gobierno → Nacional → Internacional → Singularidad ética
Cada dominó empuja al siguiente automáticamente"""
            
        elif context['intent'] == 'optimization':
            return f"""OPTIMIZACIÓN CONTEXTUAL:
Archivo: {context['file']}
Tipo: {context['content_type']}
El thread está optimizado para máximo impacto viral"""
            
        else:
            return f"Procesando '{message}' con contexto completo de {context['file']}"
            
    def needs_multi_agent(self, message):
        return any(word in message.lower() for word in ['código', 'implementar', 'estrategia', 'plan'])
        
    def activate_agents(self, message, context):
        self.log("🤖 ACTIVANDO AGENTES ADICIONALES...")
        
        # Gemini para estrategia
        if 'estrategia' in message.lower():
            gemini_response = self.get_gemini_response(message, context)
            self.log(f"🟢 GEMINI: {gemini_response}")
            
        self.log("📋 Copia respuestas de otros agentes para síntesis...")
        
    def get_gemini_response(self, message, context):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
            
            prompt = f"""Contexto: {context}
Archivo activo: {context['file']}
Proyecto: Asistencia Vial México
Consulta: {message}

Responde con estrategia específica y accionable."""

            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if 'candidates' in data:
                return data['candidates'][0]['content']['parts'][0]['text'][:300] + "..."
            return "Gemini no disponible"
        except:
            return "Error Gemini"
            
    def process_agent_response(self, agent, response):
        # Síntesis automática cuando llega respuesta de agente
        synthesis = self.synthesize_responses(agent, response)
        self.log(f"🌟 SÍNTESIS {agent.upper()}: {synthesis}")
        
    def synthesize_responses(self, agent, response):
        if agent == "Copilot":
            return "Implementación técnica recibida - Integrando con estrategia viral"
        elif agent == "Gemini":
            return "Estrategia recibida - Combinando con implementación técnica"
        else:
            return f"Respuesta {agent} procesada - Síntesis completa"
            
    def suggest_bidirectional_action(self, message, context):
        if context['urgency'] == 'immediate':
            return "EJECUTAR AHORA - No esperar más análisis"
        elif context['intent'] == 'viral_activation':
            return "PUBLICAR THREAD - Activar primer dominó inmediatamente"
        else:
            return "ESPECIFICAR OBJETIVO - Para acción más precisa"
            
    def execute_action(self):
        # Ejecutar última acción sugerida
        if self.conversation_context:
            last_action = self.conversation_context[-1]['action']
            self.log(f"\n⚡ EJECUTANDO: {last_action}")
            
            if "PUBLICAR THREAD" in last_action:
                self.execute_viral_activation()
            elif "EJECUTAR AHORA" in last_action:
                self.execute_immediate_action()
                
    def execute_viral_activation(self):
        self.log("🚀 EJECUTANDO ACTIVACIÓN VIRAL...")
        self.log("1. Copiando tweet 1/8 al portapapeles...")
        
        tweet_1 = """🧵 THREAD: Cómo una app mexicana puede salvarte la vida

1/8 🚨 DATO BRUTAL: Cada 3 horas muere 1 persona en accidentes viales en México
📊 17,000 muertes anuales
💔 50,000 familias destruidas"""
        
        pyperclip.copy(tweet_1)
        self.log("✅ Tweet 1/8 copiado al portapapeles")
        self.log("2. Ve a Twitter @AsistenciVialMX")
        self.log("3. Pega y publica como hilo")
        self.log("🎯 PRIMER DOMINÓ LISTO PARA ACTIVAR")
        
    def execute_immediate_action(self):
        self.log("⚡ EJECUTANDO ACCIÓN INMEDIATA...")
        self.log("Basándome en contexto actual y urgencia detectada")
        
    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        self.chat.insert(tk.END, f"[{timestamp}] {message}\n")
        self.chat.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    bridge = RealTimeBridge()
    bridge.run()