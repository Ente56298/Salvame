import tkinter as tk
import pyperclip
import threading
import time
import requests

class CoraBridge:
    def __init__(self):
        # Ventana simple
        self.root = tk.Tk()
        self.root.title("CO•RA Bridge")
        self.root.geometry("400x300")
        self.root.attributes("-topmost", True)
        
        # Chat
        self.chat = tk.Text(self.root, bg='black', fg='green', font=('Consolas', 10))
        self.chat.pack(fill='both', expand=True, padx=5, pady=5)
        
        # Input
        self.entry = tk.Entry(self.root, font=('Arial', 12))
        self.entry.pack(fill='x', padx=5, pady=5)
        self.entry.bind('<Return>', self.send)
        
        # Estado
        self.monitoring = False
        self.last_clipboard = ""
        
        self.log("🌟 CO•RA Bridge iniciado")
        self.log("Escribe tu pregunta y presiona Enter")
        
        # Iniciar monitoreo
        threading.Thread(target=self.monitor, daemon=True).start()
        
    def send(self, event):
        question = self.entry.get().strip()
        if not question:
            return
            
        self.entry.delete(0, tk.END)
        self.log(f"👤 {question}")
        
        # Mi respuesta inmediata
        my_response = self.get_my_response(question)
        self.log(f"🔵 Amazon Q: {my_response}")
        
        # Activar monitoreo para otros agentes
        self.monitoring = True
        self.log("📋 Copia respuestas de Copilot/Gemini...")
        
    def get_my_response(self, question):
        if "sos" in question.lower():
            return "SOS optimizado: GPS <3s, botón grande, notificación automática"
        elif "asistencia" in question.lower():
            return "Priorizar: velocidad, simplicidad, confiabilidad offline"
        else:
            return f"Para '{question}': enfoque en impacto real del usuario"
            
    def monitor(self):
        while True:
            if self.monitoring:
                try:
                    clipboard = pyperclip.paste()
                    if clipboard and clipboard != self.last_clipboard and len(clipboard) > 50:
                        self.last_clipboard = clipboard
                        
                        # Detectar agente
                        if "implementar" in clipboard.lower() or "código" in clipboard.lower():
                            agent = "🟠 Copilot"
                        elif "considera" in clipboard.lower() or "estrategia" in clipboard.lower():
                            agent = "🟢 Gemini"
                        else:
                            agent = "🤖 Agente"
                            
                        self.log(f"{agent}: {clipboard[:200]}...")
                        
                        # Síntesis CO•RA
                        synthesis = self.synthesize(clipboard)
                        self.log(f"🌟 CO•RA: {synthesis}")
                        
                        self.monitoring = False
                        
                except:
                    pass
                    
            time.sleep(1)
            
    def synthesize(self, response):
        return f"Síntesis ética: Implementar con propósito de salvar vidas. Priorizar velocidad y simplicidad para emergencias reales."
        
    def log(self, message):
        self.chat.insert(tk.END, f"{message}\n")
        self.chat.see(tk.END)
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    bridge = CoraBridge()
    bridge.run()