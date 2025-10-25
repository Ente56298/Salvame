import tkinter as tk
from tkinter import ttk, scrolledtext
import threading
import requests
import json
import time
from datetime import datetime

class CoraFloatingChat:
    def __init__(self):
        self.root = tk.Tk()
        self.setup_window()
        self.setup_ui()
        self.gemini_api_key = "AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
        self.conversation_history = []
        
    def setup_window(self):
        """Configura ventana flotante"""
        self.root.title("CO•RA Multi-Agent Chat")
        self.root.geometry("400x600")
        self.root.attributes("-topmost", True)  # Siempre encima
        self.root.configure(bg='#1a1a1a')
        
        # Hacer ventana arrastrable
        self.root.bind('<Button-1>', self.start_drag)
        self.root.bind('<B1-Motion>', self.drag_window)
        
    def setup_ui(self):
        """Configura interfaz de usuario"""
        # Header CO•RA
        header = tk.Frame(self.root, bg='#2d2d2d', height=50)
        header.pack(fill='x', padx=5, pady=5)
        
        title = tk.Label(header, text="🌟 CO•RA Multi-Agent", 
                        bg='#2d2d2d', fg='#00ff88', 
                        font=('Arial', 12, 'bold'))
        title.pack(side='left', padx=10, pady=10)
        
        # Botón minimizar
        minimize_btn = tk.Button(header, text="−", bg='#ff6b6b', fg='white',
                               command=self.minimize_window, width=3)
        minimize_btn.pack(side='right', padx=5, pady=5)
        
        # Chat area
        self.chat_area = scrolledtext.ScrolledText(
            self.root, bg='#0d1117', fg='#c9d1d9',
            font=('Consolas', 10), wrap=tk.WORD,
            height=25, width=50
        )
        self.chat_area.pack(fill='both', expand=True, padx=5, pady=5)
        
        # Input area
        input_frame = tk.Frame(self.root, bg='#1a1a1a')
        input_frame.pack(fill='x', padx=5, pady=5)
        
        self.input_entry = tk.Entry(input_frame, bg='#21262d', fg='#c9d1d9',
                                   font=('Arial', 10), insertbackground='#c9d1d9')
        self.input_entry.pack(side='left', fill='x', expand=True, padx=(0,5))
        self.input_entry.bind('<Return>', self.send_message)
        
        send_btn = tk.Button(input_frame, text="Enviar", bg='#238636', fg='white',
                           command=self.send_message, font=('Arial', 9, 'bold'))
        send_btn.pack(side='right')
        
        # Agent status
        status_frame = tk.Frame(self.root, bg='#1a1a1a')
        status_frame.pack(fill='x', padx=5, pady=2)
        
        self.status_label = tk.Label(status_frame, text="🔵 Amazon Q  🟢 Gemini  🟠 Copilot  🌟 CO•RA",
                                   bg='#1a1a1a', fg='#7d8590', font=('Arial', 8))
        self.status_label.pack()
        
        # Mensaje inicial
        self.add_message("🌟 CO•RA", "Chat multi-agente iniciado. Pregunta sobre Asistencia Vial.", "#00ff88")
        
    def start_drag(self, event):
        """Inicia arrastre de ventana"""
        self.x = event.x
        self.y = event.y
        
    def drag_window(self, event):
        """Arrastra ventana siguiendo el ratón"""
        deltax = event.x - self.x
        deltay = event.y - self.y
        x = self.root.winfo_x() + deltax
        y = self.root.winfo_y() + deltay
        self.root.geometry(f"+{x}+{y}")
        
    def minimize_window(self):
        """Minimiza ventana"""
        self.root.iconify()
        
    def add_message(self, sender, message, color="#c9d1d9"):
        """Agrega mensaje al chat"""
        timestamp = datetime.now().strftime("%H:%M")
        self.chat_area.insert(tk.END, f"[{timestamp}] {sender}:\n", "sender")
        self.chat_area.insert(tk.END, f"{message}\n\n", "message")
        
        # Configurar colores
        self.chat_area.tag_config("sender", foreground=color, font=('Arial', 9, 'bold'))
        self.chat_area.tag_config("message", foreground="#c9d1d9", font=('Arial', 9))
        
        self.chat_area.see(tk.END)
        
    def send_message(self, event=None):
        """Envía mensaje y procesa respuestas"""
        message = self.input_entry.get().strip()
        if not message:
            return
            
        self.input_entry.delete(0, tk.END)
        
        # Mostrar mensaje del usuario
        self.add_message("👤 Usuario", message, "#58a6ff")
        
        # Procesar en hilo separado para no bloquear UI
        threading.Thread(target=self.process_multi_agent, args=(message,), daemon=True).start()
        
    def process_multi_agent(self, message):
        """Procesa mensaje con todos los agentes"""
        self.update_status("Procesando con agentes...")
        
        # Amazon Q (mi respuesta)
        amazonq_response = self.get_amazonq_response(message)
        self.add_message("🔵 Amazon Q", amazonq_response, "#58a6ff")
        
        # Gemini AI
        self.update_status("Consultando Gemini...")
        gemini_response = self.get_gemini_response(message)
        self.add_message("🟢 Gemini", gemini_response, "#3fb950")
        
        # Copilot (simulado)
        copilot_response = self.get_copilot_response(message)
        self.add_message("🟠 Copilot", copilot_response, "#f78166")
        
        # CO•RA Síntesis
        self.update_status("CO•RA generando síntesis...")
        cora_synthesis = self.generate_cora_synthesis(message, amazonq_response, gemini_response, copilot_response)
        self.add_message("🌟 CO•RA", cora_synthesis, "#00ff88")
        
        self.update_status("🔵 Amazon Q  🟢 Gemini  🟠 Copilot  🌟 CO•RA")
        
    def get_amazonq_response(self, message):
        """Mi respuesta como Amazon Q"""
        if "sos" in message.lower():
            return "Para SOS optimizado: GPS <3s, botón pánico visible, notificaciones automáticas, cache de ubicación para casos sin señal."
        elif "asistencia vial" in message.lower():
            return "Asistencia Vial necesita: geolocalización ultra-rápida, UI intuitiva para emergencias, integración servicios locales, sistema notificaciones robusto."
        else:
            return f"Analizando '{message}' para Asistencia Vial. Enfoque en UX, performance y seguridad del usuario."
            
    def get_gemini_response(self, message):
        """Obtiene respuesta de Gemini AI"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Contexto: Desarrollo Asistencia Vial México, app emergencias viales. Pregunta: {message}"
                    }]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if 'candidates' in data and data['candidates']:
                return data['candidates'][0]['content']['parts'][0]['text'][:300] + "..."
            else:
                return "Gemini no disponible en este momento."
                
        except Exception as e:
            return f"Error Gemini: Conexión no disponible"
            
    def get_copilot_response(self, message):
        """Simula respuesta de Copilot"""
        if "sos" in message.lower():
            return "```javascript\n// SOS optimizado\nconst handleSOS = async () => {\n  const location = await getCurrentPosition({timeout: 3000});\n  await sendEmergencyAlert(location);\n  notifyContacts();\n};\n```"
        else:
            return "Implementar con React hooks, useGeolocation para GPS, useState para UI state, useEffect para lifecycle management."
            
    def generate_cora_synthesis(self, question, amazonq, gemini, copilot):
        """Genera síntesis CO•RA con perspectiva ética"""
        return f"""🌟 SÍNTESIS ÉTICA CO•RA:

Para "{question}" en Asistencia Vial, la intención real es salvar vidas.

🔵 Técnico (Amazon Q): {amazonq[:80]}...
🟢 Estratégico (Gemini): {gemini[:80]}...  
🟠 Implementación (Copilot): {copilot[:80]}...

💡 RECOMENDACIÓN ÉTICA:
Priorizar velocidad de respuesta sobre métricas. Cada segundo cuenta en emergencias reales. Implementar con propósito superior: proteger vidas humanas.

🚀 Próximo paso: ¿Implementamos la solución más ética y efectiva?"""
        
    def update_status(self, status):
        """Actualiza estado de agentes"""
        self.status_label.config(text=status)
        self.root.update()
        
    def run(self):
        """Ejecuta la aplicación"""
        self.root.mainloop()

if __name__ == "__main__":
    app = CoraFloatingChat()
    app.run()