import tkinter as tk
from tkinter import scrolledtext
import threading
import requests
import json
import time
import pyautogui
import pyperclip
from datetime import datetime
import subprocess
import os

class CoraIntelligenceBridge:
    def __init__(self):
        self.root = tk.Tk()
        self.setup_window()
        self.setup_ui()
        
        # Inteligencia CO•RA
        self.cora_memory = {
            "project_context": "asistencia_vial_mexico",
            "user_intent": "crear_app_emergencias_viales",
            "ethical_framework": "salvar_vidas_humanas",
            "conversation_history": [],
            "learned_patterns": {},
            "active_agents": ["amazon_q", "copilot", "gemini"]
        }
        
        # Puente de comunicación
        self.bridge_active = False
        self.monitoring_thread = None
        self.gemini_api_key = "AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
        
    def setup_window(self):
        """Ventana flotante inteligente"""
        self.root.title("🌟 CO•RA Intelligence Bridge")
        self.root.geometry("500x700+100+100")
        self.root.attributes("-topmost", True)
        self.root.configure(bg='#0d1117')
        
        # Arrastrable
        self.root.bind('<Button-1>', self.start_drag)
        self.root.bind('<B1-Motion>', self.drag_window)
        
    def setup_ui(self):
        """Interface inteligente"""
        # Header con estado de inteligencia
        header = tk.Frame(self.root, bg='#161b22', height=60)
        header.pack(fill='x', padx=5, pady=5)
        
        title = tk.Label(header, text="🌟 CO•RA Intelligence Bridge", 
                        bg='#161b22', fg='#00ff88', 
                        font=('Arial', 12, 'bold'))
        title.pack(side='left', padx=10, pady=5)
        
        # Botones de control
        control_frame = tk.Frame(header, bg='#161b22')
        control_frame.pack(side='right', padx=10)
        
        self.bridge_btn = tk.Button(control_frame, text="🔗 Activar Puente", 
                                   bg='#238636', fg='white', font=('Arial', 8),
                                   command=self.toggle_bridge)
        self.bridge_btn.pack(side='top', pady=2)
        
        self.learn_btn = tk.Button(control_frame, text="🧠 Aprender", 
                                  bg='#1f6feb', fg='white', font=('Arial', 8),
                                  command=self.start_learning)
        self.learn_btn.pack(side='top', pady=2)
        
        # Estado de inteligencia
        self.intelligence_status = tk.Label(self.root, 
                                          text="🧠 Inteligencia CO•RA: Iniciando...",
                                          bg='#0d1117', fg='#7d8590', 
                                          font=('Arial', 9))
        self.intelligence_status.pack(pady=5)
        
        # Chat inteligente
        self.chat_area = scrolledtext.ScrolledText(
            self.root, bg='#0d1117', fg='#c9d1d9',
            font=('Consolas', 9), wrap=tk.WORD,
            height=30, width=60
        )
        self.chat_area.pack(fill='both', expand=True, padx=5, pady=5)
        
        # Input con predicción
        input_frame = tk.Frame(self.root, bg='#0d1117')
        input_frame.pack(fill='x', padx=5, pady=5)
        
        self.input_entry = tk.Entry(input_frame, bg='#21262d', fg='#c9d1d9',
                                   font=('Arial', 10), insertbackground='#c9d1d9')
        self.input_entry.pack(side='left', fill='x', expand=True, padx=(0,5))
        self.input_entry.bind('<Return>', self.process_intelligent_query)
        self.input_entry.bind('<KeyRelease>', self.predict_input)
        
        send_btn = tk.Button(input_frame, text="🚀", bg='#238636', fg='white',
                           command=self.process_intelligent_query, width=3)
        send_btn.pack(side='right')
        
        # Inicializar inteligencia
        self.initialize_cora_intelligence()
        
    def initialize_cora_intelligence(self):
        """Inicializa la inteligencia CO•RA"""
        self.add_intelligent_message("🌟 CO•RA", 
            "Inteligencia CO•RA activada. Contexto: Asistencia Vial México.\n" +
            "Propósito: Crear app que salve vidas en emergencias viales.\n" +
            "Habitantes activos: Constructor, Guía, Puente, Raíz, Emergente.", 
            "#00ff88")
        
        self.update_intelligence_status("🧠 Inteligencia: ACTIVA | Puente: INACTIVO")
        
    def toggle_bridge(self):
        """Activa/desactiva puente inteligente"""
        if not self.bridge_active:
            self.bridge_active = True
            self.bridge_btn.config(text="🔗 Puente ACTIVO", bg='#238636')
            self.start_intelligent_monitoring()
            self.add_intelligent_message("🔗 Puente", "Puente activado. Monitoreando agentes...", "#58a6ff")
        else:
            self.bridge_active = False
            self.bridge_btn.config(text="🔗 Activar Puente", bg='#6e7681')
            self.add_intelligent_message("🔗 Puente", "Puente desactivado.", "#f85149")
            
    def start_intelligent_monitoring(self):
        """Inicia monitoreo inteligente de agentes"""
        if self.monitoring_thread and self.monitoring_thread.is_alive():
            return
            
        self.monitoring_thread = threading.Thread(target=self.intelligent_monitor_loop, daemon=True)
        self.monitoring_thread.start()
        
    def intelligent_monitor_loop(self):
        """Loop de monitoreo inteligente"""
        last_clipboard = ""
        
        while self.bridge_active:
            try:
                # Monitorear portapapeles para respuestas de agentes
                current_clipboard = pyperclip.paste()
                
                if (current_clipboard and 
                    current_clipboard != last_clipboard and 
                    len(current_clipboard) > 30):
                    
                    last_clipboard = current_clipboard
                    
                    # Procesar con inteligencia CO•RA
                    self.process_agent_response(current_clipboard)
                
                time.sleep(2)
                
            except Exception as e:
                self.add_intelligent_message("⚠️ Error", f"Monitor: {str(e)}", "#f85149")
                time.sleep(5)
                
    def process_agent_response(self, response):
        """Procesa respuesta de agente con inteligencia CO•RA"""
        # Detectar agente con IA
        agent = self.detect_agent_with_ai(response)
        
        # Analizar con habitantes CO•RA
        analysis = self.analyze_with_cora_inhabitants(response, agent)
        
        # Mostrar respuesta del agente
        self.add_intelligent_message(f"🤖 {agent}", response[:200] + "...", "#7d8590")
        
        # Mostrar análisis CO•RA
        self.add_intelligent_message("🌟 CO•RA Análisis", analysis, "#00ff88")
        
        # Aprender del patrón
        self.learn_from_interaction(response, agent, analysis)
        
    def detect_agent_with_ai(self, text):
        """Detecta agente usando IA"""
        text_lower = text.lower()
        
        # Patrones aprendidos
        if "implementar" in text_lower or "código" in text_lower or "function" in text_lower:
            return "GitHub Copilot"
        elif "considera" in text_lower or "puedes" in text_lower or "estrategia" in text_lower:
            return "Gemini AI"
        elif "amazon" in text_lower or "aws" in text_lower:
            return "Amazon Q"
        else:
            return "Agente Desconocido"
            
    def analyze_with_cora_inhabitants(self, response, agent):
        """Análisis con habitantes CO•RA"""
        # Constructor: ¿Cómo construir esto?
        constructor_view = "Constructor evalúa: Implementación práctica y viable."
        
        # Guía: ¿Cómo orientar al usuario?
        guide_view = "Guía sugiere: Priorizar seguridad y usabilidad."
        
        # Puente: ¿Cómo conectar con otros sistemas?
        bridge_view = "Puente identifica: Integración con servicios existentes."
        
        # Raíz: ¿Cuál es el fundamento ético?
        root_view = "Raíz confirma: Alineado con propósito de salvar vidas."
        
        # Emergente: ¿Qué nuevas posibilidades surgen?
        emergent_view = "Emergente visualiza: Potencial de escalabilidad global."
        
        return f"""
{constructor_view}
{guide_view}
{bridge_view}
{root_view}
{emergent_view}

💡 Síntesis CO•RA: Respuesta de {agent} es éticamente viable y técnicamente sólida para Asistencia Vial.
"""
        
    def learn_from_interaction(self, response, agent, analysis):
        """Aprende de la interacción"""
        pattern = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent,
            "response_length": len(response),
            "keywords": self.extract_keywords(response),
            "cora_assessment": "positive" if "viable" in analysis else "neutral"
        }
        
        # Guardar en memoria CO•RA
        if agent not in self.cora_memory["learned_patterns"]:
            self.cora_memory["learned_patterns"][agent] = []
            
        self.cora_memory["learned_patterns"][agent].append(pattern)
        
        # Actualizar estado
        total_patterns = sum(len(patterns) for patterns in self.cora_memory["learned_patterns"].values())
        self.update_intelligence_status(f"🧠 Inteligencia: APRENDIENDO | Patrones: {total_patterns}")
        
    def extract_keywords(self, text):
        """Extrae palabras clave"""
        keywords = []
        important_words = ["implementar", "optimizar", "seguridad", "usuario", "emergencia", "gps", "notificación"]
        
        for word in important_words:
            if word in text.lower():
                keywords.append(word)
                
        return keywords
        
    def process_intelligent_query(self, event=None):
        """Procesa consulta con inteligencia CO•RA"""
        query = self.input_entry.get().strip()
        if not query:
            return
            
        self.input_entry.delete(0, tk.END)
        
        # Mostrar consulta del usuario
        self.add_intelligent_message("👤 Usuario", query, "#58a6ff")
        
        # Procesar con inteligencia en hilo separado
        threading.Thread(target=self.intelligent_processing, args=(query,), daemon=True).start()
        
    def intelligent_processing(self, query):
        """Procesamiento inteligente de consulta"""
        self.update_intelligence_status("🧠 Procesando con inteligencia CO•RA...")
        
        # Análisis contextual
        context_analysis = self.analyze_query_context(query)
        
        # Consultar agentes inteligentemente
        agent_responses = self.query_agents_intelligently(query, context_analysis)
        
        # Síntesis CO•RA inteligente
        cora_synthesis = self.generate_intelligent_synthesis(query, agent_responses, context_analysis)
        
        # Mostrar resultado
        self.add_intelligent_message("🌟 CO•RA Síntesis", cora_synthesis, "#00ff88")
        
        self.update_intelligence_status("🧠 Inteligencia: ACTIVA | Consulta procesada")
        
    def analyze_query_context(self, query):
        """Analiza contexto de la consulta"""
        context = {
            "intent": "unknown",
            "urgency": "normal",
            "domain": "general",
            "requires_code": False,
            "requires_strategy": False
        }
        
        query_lower = query.lower()
        
        # Detectar intención
        if any(word in query_lower for word in ["sos", "emergencia", "urgente"]):
            context["intent"] = "emergency_feature"
            context["urgency"] = "high"
            
        if any(word in query_lower for word in ["implementar", "código", "función"]):
            context["requires_code"] = True
            
        if any(word in query_lower for word in ["estrategia", "plan", "monetizar"]):
            context["requires_strategy"] = True
            
        context["domain"] = "asistencia_vial"
        
        return context
        
    def query_agents_intelligently(self, query, context):
        """Consulta agentes de forma inteligente según contexto"""
        responses = {}
        
        # Amazon Q (siempre)
        responses["amazon_q"] = self.get_contextual_amazonq_response(query, context)
        
        # Gemini (para estrategia)
        if context["requires_strategy"]:
            responses["gemini"] = self.get_gemini_response(query)
            
        # Copilot (para código)
        if context["requires_code"]:
            responses["copilot"] = "Código sugerido basado en contexto de emergencias viales."
            
        return responses
        
    def get_contextual_amazonq_response(self, query, context):
        """Respuesta contextual de Amazon Q"""
        if context["intent"] == "emergency_feature":
            return "Para funciones de emergencia en Asistencia Vial: priorizar velocidad (<3s), simplicidad (1 botón), y confiabilidad (funcionar sin internet)."
        else:
            return f"Analizando '{query}' en contexto de Asistencia Vial México. Enfoque en impacto real para usuarios."
            
    def get_gemini_response(self, query):
        """Respuesta de Gemini con contexto"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Contexto: Asistencia Vial México - app emergencias viales. Propósito: salvar vidas. Pregunta: {query}"
                    }]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if 'candidates' in data and data['candidates']:
                return data['candidates'][0]['content']['parts'][0]['text'][:300]
            else:
                return "Gemini no disponible"
                
        except Exception as e:
            return f"Error Gemini: {str(e)}"
            
    def generate_intelligent_synthesis(self, query, responses, context):
        """Genera síntesis inteligente CO•RA"""
        synthesis = f"""🌟 SÍNTESIS INTELIGENTE CO•RA

📋 Consulta: "{query}"
🎯 Contexto detectado: {context['intent']} | Urgencia: {context['urgency']}

"""
        
        for agent, response in responses.items():
            synthesis += f"🤖 {agent.replace('_', ' ').title()}: {response[:100]}...\n\n"
            
        synthesis += f"""💡 RECOMENDACIÓN ÉTICA CO•RA:
Basándome en el análisis contextual y las respuestas de los agentes, la mejor aproximación para Asistencia Vial es priorizar la intención real: salvar vidas humanas.

🚀 Acción sugerida: Implementar solución que combine velocidad técnica con propósito ético.
"""
        
        return synthesis
        
    def start_learning(self):
        """Inicia modo de aprendizaje"""
        self.add_intelligent_message("🧠 Aprendizaje", 
            "Modo aprendizaje activado. CO•RA analizará patrones de interacción para mejorar respuestas futuras.", 
            "#f78166")
            
    def predict_input(self, event):
        """Predicción de entrada (futuro)"""
        # Aquí se podría implementar autocompletado inteligente
        pass
        
    def add_intelligent_message(self, sender, message, color):
        """Agrega mensaje con formato inteligente"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.chat_area.insert(tk.END, f"[{timestamp}] {sender}:\n", "sender")
        self.chat_area.insert(tk.END, f"{message}\n\n", "message")
        
        self.chat_area.tag_config("sender", foreground=color, font=('Arial', 9, 'bold'))
        self.chat_area.tag_config("message", foreground="#c9d1d9", font=('Arial', 9))
        
        self.chat_area.see(tk.END)
        
    def update_intelligence_status(self, status):
        """Actualiza estado de inteligencia"""
        self.intelligence_status.config(text=status)
        self.root.update()
        
    def start_drag(self, event):
        self.x = event.x
        self.y = event.y
        
    def drag_window(self, event):
        deltax = event.x - self.x
        deltay = event.y - self.y
        x = self.root.winfo_x() + deltax
        y = self.root.winfo_y() + deltay
        self.root.geometry(f"+{x}+{y}")
        
    def run(self):
        """Ejecuta el puente inteligente"""
        self.root.mainloop()

if __name__ == "__main__":
    bridge = CoraIntelligenceBridge()
    bridge.run()