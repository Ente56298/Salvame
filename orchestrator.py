import tkinter as tk
import pyperclip
import threading
import time
import requests
import json

class Orchestrator:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Orchestrator")
        self.root.geometry("700x500")
        self.root.configure(bg='#1a1a1a')
        
        # Chat
        self.chat = tk.Text(self.root, bg='#1a1a1a', fg='#ffffff', font=('Consolas', 11))
        self.chat.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Input
        self.entry = tk.Entry(self.root, bg='#2d2d2d', fg='#ffffff', font=('Arial', 12))
        self.entry.pack(fill='x', padx=10, pady=5)
        self.entry.bind('<Return>', self.orchestrate)
        
        # Estado
        self.waiting_for_agents = False
        self.current_query = ""
        self.agent_responses = {}
        
        self.log("🎯 Orchestrator iniciado")
        self.log("Escribe tu objetivo y presiona Enter")
        
        # Monitor
        threading.Thread(target=self.monitor_agents, daemon=True).start()
        
    def orchestrate(self, event):
        query = self.entry.get().strip()
        if not query:
            return
            
        self.entry.delete(0, tk.END)
        self.current_query = query
        self.agent_responses = {}
        
        self.log(f"\n🎯 OBJETIVO: {query}")
        self.log("=" * 50)
        
        # Mi análisis inmediato
        analysis = self.analyze_objective(query)
        self.log(f"📊 ANÁLISIS: {analysis}")
        
        # Plan de orquestación
        plan = self.create_orchestration_plan(query)
        self.log(f"📋 PLAN: {plan}")
        
        # Activar agentes
        self.activate_agents(query)
        
    def analyze_objective(self, query):
        if "asistencia vial" in query.lower():
            return "Proyecto crítico - impacto en seguridad vial México"
        elif "monetizar" in query.lower():
            return "Estrategia comercial - balance ético vs rentabilidad"
        elif "viral" in query.lower():
            return "Distribución masiva - alcance máximo usuarios"
        else:
            return "Objetivo general - requiere especificación"
            
    def create_orchestration_plan(self, query):
        if "sos" in query.lower():
            return "1) Optimizar GPS 2) Mejorar UI 3) Integrar notificaciones"
        elif "deploy" in query.lower():
            return "1) Verificar build 2) Configurar dominio 3) Monitorear"
        else:
            return "1) Definir alcance 2) Asignar recursos 3) Ejecutar"
            
    def activate_agents(self, query):
        self.log("\n🤖 ACTIVANDO AGENTES...")
        
        # Amazon Q (yo)
        my_response = self.get_my_orchestration(query)
        self.agent_responses["amazon_q"] = my_response
        self.log(f"🔵 Amazon Q: {my_response}")
        
        # Gemini
        gemini_response = self.get_gemini_orchestration(query)
        self.agent_responses["gemini"] = gemini_response
        self.log(f"🟢 Gemini: {gemini_response}")
        
        # Esperar Copilot
        self.log("🟠 Esperando Copilot... (copia su respuesta)")
        self.waiting_for_agents = True
        
    def get_my_orchestration(self, query):
        if "sos" in query.lower():
            return "Prioridad: velocidad <3s, simplicidad 1-tap, confiabilidad offline"
        elif "viral" in query.lower():
            return "Estrategia: contenido emocional + datos duros + call-to-action claro"
        else:
            return f"Orquestando '{query}' con enfoque en impacto real"
            
    def get_gemini_orchestration(self, query):
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Como orquestador de proyecto Asistencia Vial México: {query}. Responde con plan de acción específico."
                    }]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if 'candidates' in data:
                return data['candidates'][0]['content']['parts'][0]['text'][:200] + "..."
            return "Gemini no disponible"
        except:
            return "Error conectando Gemini"
            
    def monitor_agents(self):
        last_clipboard = ""
        
        while True:
            if self.waiting_for_agents:
                clipboard = pyperclip.paste()
                
                if clipboard and clipboard != last_clipboard and len(clipboard) > 30:
                    last_clipboard = clipboard
                    
                    # Detectar Copilot
                    if any(word in clipboard.lower() for word in ['código', 'implementar', 'function']):
                        self.agent_responses["copilot"] = clipboard
                        self.log(f"🟠 Copilot: {clipboard[:200]}...")
                        
                        # Orquestar resultado final
                        self.orchestrate_final_result()
                        self.waiting_for_agents = False
                        
            time.sleep(1)
            
    def orchestrate_final_result(self):
        self.log("\n🎯 ORQUESTACIÓN FINAL:")
        self.log("=" * 50)
        
        # Síntesis de todos los agentes
        synthesis = self.synthesize_agents()
        self.log(f"🧠 SÍNTESIS: {synthesis}")
        
        # Plan de ejecución
        execution_plan = self.create_execution_plan()
        self.log(f"⚡ EJECUCIÓN: {execution_plan}")
        
        # Próximos pasos
        next_steps = self.define_next_steps()
        self.log(f"🚀 PRÓXIMOS PASOS: {next_steps}")
        
    def synthesize_agents(self):
        amazon_q = self.agent_responses.get("amazon_q", "")
        gemini = self.agent_responses.get("gemini", "")
        copilot = self.agent_responses.get("copilot", "")
        
        return f"Combinando: análisis técnico (Amazon Q) + estrategia (Gemini) + implementación (Copilot) = solución integral"
        
    def create_execution_plan(self):
        if "sos" in self.current_query.lower():
            return "1) Reducir timeout GPS 2) Agrandar botón 3) Probar con usuarios"
        elif "viral" in self.current_query.lower():
            return "1) Publicar thread Twitter 2) Compartir en grupos 3) Contactar medios"
        else:
            return "1) Definir métricas 2) Asignar recursos 3) Ejecutar iterativamente"
            
    def define_next_steps(self):
        return "Implementar la solución más viable, medir impacto real, iterar basado en feedback"
        
    def log(self, message):
        self.chat.insert(tk.END, f"{message}\n")
        self.chat.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    orchestrator = Orchestrator()
    orchestrator.run()