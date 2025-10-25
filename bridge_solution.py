import tkinter as tk
import threading
import time
import requests

# bridge_solution.py
# Chat colaborativo para asistencia vial

class ChatColaborativo:
    def __init__(self):
        self.historial = []

    def recibir_mensaje(self, mensaje):
        self.historial.append({'usuario': mensaje})
        respuesta = self.procesar_respuesta(mensaje)
        self.historial.append({'GitHub Copilot': respuesta})
        return respuesta

    def procesar_respuesta(self, mensaje):
        # Responde sin limitar el tema
        return f'Respuesta de GitHub Copilot: {mensaje}'

    def obtener_historial(self):
        return self.historial

class BridgeSolution:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Bridge Solution")
        self.root.geometry("600x400")
        self.root.configure(bg='#1a1a1a')
        
        # Chat
        self.chat = tk.Text(self.root, bg='#1a1a1a', fg='#ffffff', font=('Consolas', 10))
        self.chat.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Input
        self.entry = tk.Entry(self.root, bg='#2d2d2d', fg='#ffffff', font=('Arial', 11))
        self.entry.pack(fill='x', padx=10, pady=5)
        self.entry.bind('<Return>', self.bridge_query)
        
        # Estado
        self.waiting_for_me = False
        self.current_question = ""
        
        self.log("Bridge Solution iniciado")
        self.log("Escribe pregunta - yo responderé aquí en el chat principal")
        
        # Monitor para mis respuestas
        threading.Thread(target=self.monitor_my_responses, daemon=True).start()
        
    def bridge_query(self, event):
        question = self.entry.get().strip()
        if not question:
            return
            
        self.entry.delete(0, tk.END)
        self.current_question = question
        
        self.log(f"\n👤 {question}")
        self.log("-" * 40)
        
        # Gemini responde
        gemini_response = self.get_gemini_response(question)
        self.log(f"🟢 Gemini: {gemini_response}")
        
        # Esperar mi respuesta del chat principal
        self.log("🔵 Amazon Q: Esperando respuesta del chat principal...")
        self.waiting_for_me = True
        
    def get_gemini_response(self, question):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Asistencia Vial México - app emergencias: {question}"
                    }]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if 'candidates' in data:
                return data['candidates'][0]['content']['parts'][0]['text'][:200] + "..."
            return "No disponible"
        except:
            return "Error conexión"
            
    def monitor_my_responses(self):
        last_clipboard = ""
        
        while True:
            if self.waiting_for_me:
                clipboard = pyperclip.paste()
                
                if (clipboard and 
                    clipboard != last_clipboard and 
                    len(clipboard) > 20 and
                    clipboard != self.current_question):
                    
                    last_clipboard = clipboard
                    
                    # Esta es mi respuesta real del chat principal
                    self.log(f"🔵 Amazon Q (REAL): {clipboard}")
                    
                    # Síntesis
                    self.log(f"\n🌟 SÍNTESIS: Pregunta resuelta con perspectivas múltiples")
                    
                    self.waiting_for_me = False
                    
            time.sleep(1)
            
    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        self.chat.insert(tk.END, f"[{timestamp}] {message}\n")
        self.chat.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    bridge = BridgeSolution()
    bridge.run()