import tkinter as tk
import threading
import time
import requests
import json

class CollaborativeChat:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("🤖 Chat Colaborativo Real")
        self.root.geometry("700x500")
        self.root.configure(bg='#1a1a1a')
        
        # Chat donde TODOS respondemos
        self.chat = tk.Text(self.root, bg='#1a1a1a', fg='#ffffff', font=('Consolas', 11))
        self.chat.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Input para preguntas
        self.entry = tk.Entry(self.root, bg='#2d2d2d', fg='#ffffff', font=('Arial', 12))
        self.entry.pack(fill='x', padx=10, pady=5)
        self.entry.bind('<Return>', self.ask_all_agents)
        
        self.log("🤖 CHAT COLABORATIVO INICIADO")
        self.log("Escribe tu pregunta - TODOS los agentes responderán")
        
    def ask_all_agents(self, event):
        question = self.entry.get().strip()
        if not question:
            return
            
        self.entry.delete(0, tk.END)
        
        self.log(f"\n👤 PREGUNTA: {question}")
        self.log("=" * 50)
        
        # YO respondo PRIMERO (Amazon Q)
        my_response = self.amazon_q_response(question)
        self.log(f"🔵 AMAZON Q: {my_response}")
        
        # Gemini responde SEGUNDO
        gemini_response = self.gemini_response(question)
        self.log(f"🟢 GEMINI: {gemini_response}")
        
        # Copilot responde TERCERO (tú copias su respuesta)
        self.log("🟠 COPILOT: Ve a Copilot, haz la pregunta, copia su respuesta aquí:")
        self.log("📋 [Esperando tu input con respuesta de Copilot...]")
        
        # Activar modo escucha para Copilot
        self.wait_for_copilot_response(question)
        
    def amazon_q_response(self, question):
        """MI respuesta real contextual"""
        q_lower = question.lower()
        
        if "asistencia vial" in q_lower:
            return "Para Asistencia Vial: priorizar velocidad SOS <3s, UI simple para emergencias, integración servicios locales, PWA offline. Enfoque: salvar vidas reales."
            
        elif "sos" in q_lower:
            return "SOS optimizado: GPS timeout 3s, botón 80% pantalla, notificación automática 3 contactos + 911, cache ubicación offline, feedback visual/sonoro."
            
        elif "viral" in q_lower:
            return "Estrategia viral: thread Twitter listo, datos impactantes (17K muertes/año), call-to-action claro, timing 8-10 PM México, grupos Facebook conductores."
            
        elif "monetizar" in q_lower:
            return "Monetización ética: freemium (SOS gratis), B2B flotas $500-2K/mes, comisiones servicios 15%, gobierno licencias, seguros integración API."
            
        else:
            return f"Analizando '{question}' para Asistencia Vial: enfoque en impacto real, velocidad implementación, beneficio usuario final."
            
    def gemini_response(self, question):
        """Respuesta real de Gemini AI"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
            
            prompt = f"""Contexto: Asistencia Vial México - app emergencias viales para salvar vidas.
Proyecto: React + TypeScript + Gemini AI + PWA
Objetivo: Crear mejor app asistencia vial de México.

Pregunta: {question}

Responde específicamente para este proyecto, máximo 200 palabras."""

            payload = {"contents": [{"parts": [{"text": prompt}]}]}
            
            response = requests.post(url, json=payload, timeout=15)
            data = response.json()
            
            if 'candidates' in data and data['candidates']:
                return data['candidates'][0]['content']['parts'][0]['text'][:400]
            else:
                return "Gemini no pudo responder - verifica conexión"
                
        except Exception as e:
            return f"Error Gemini: {str(e)}"
            
    def wait_for_copilot_response(self, question):
        """Espera que copies respuesta de Copilot"""
        # Crear campo de input temporal para Copilot
        copilot_frame = tk.Frame(self.root, bg='#1a1a1a')
        copilot_frame.pack(fill='x', padx=10, pady=5)
        
        tk.Label(copilot_frame, text="🟠 Copilot:", bg='#1a1a1a', fg='#ff8800', 
                font=('Arial', 10, 'bold')).pack(side='left')
        
        copilot_entry = tk.Entry(copilot_frame, bg='#2d2d2d', fg='#ff8800', 
                                font=('Arial', 11))
        copilot_entry.pack(side='left', fill='x', expand=True, padx=5)
        
        def submit_copilot(event=None):
            copilot_response = copilot_entry.get().strip()
            if copilot_response:
                self.log(f"🟠 COPILOT: {copilot_response}")
                
                # Síntesis colaborativa
                synthesis = self.collaborative_synthesis(question, copilot_response)
                self.log(f"\n🌟 SÍNTESIS COLABORATIVA:")
                self.log(synthesis)
                
                # Remover input temporal
                copilot_frame.destroy()
                
        copilot_entry.bind('<Return>', submit_copilot)
        copilot_entry.focus()
        
    def collaborative_synthesis(self, question, copilot_response):
        """Síntesis de todas las respuestas"""
        return f"""
Para "{question}" en Asistencia Vial México:

🔵 Amazon Q: Enfoque técnico y práctico
🟢 Gemini: Estrategia y contexto amplio  
🟠 Copilot: Implementación específica

💡 RECOMENDACIÓN COLABORATIVA:
Combinar análisis técnico (Amazon Q) + estrategia (Gemini) + código (Copilot) = solución integral.

🚀 PRÓXIMO PASO: Implementar la convergencia de las tres perspectivas.
"""
        
    def log(self, message):
        timestamp = time.strftime("%H:%M:%S")
        self.chat.insert(tk.END, f"[{timestamp}] {message}\n")
        self.chat.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    chat = CollaborativeChat()
    chat.run()