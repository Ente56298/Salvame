import time
import pyperclip
import requests
import json
from datetime import datetime

class MultiAgentCoordinator:
    def __init__(self):
        self.conversation_log = []
        self.current_question = ""
        self.responses_received = {}
        self.expected_agents = ["copilot", "gemini", "amazonq"]
        
    def start_conversation(self):
        """Inicia conversación multi-agente"""
        print("🤖 CHAT MULTI-AGENTE INICIADO")
        print("=" * 50)
        print("Agentes activos: GitHub Copilot, Gemini AI, Amazon Q")
        print("Escribe 'salir' para terminar\n")
        
        while True:
            try:
                # Obtener pregunta del usuario
                question = input("👤 Tu pregunta: ").strip()
                
                if question.lower() in ['salir', 'exit', 'quit']:
                    break
                    
                if not question:
                    continue
                    
                self.current_question = question
                self.responses_received = {}
                
                # Coordinar respuestas por turnos
                self.coordinate_responses(question)
                
            except KeyboardInterrupt:
                break
                
        print("\n👋 Conversación finalizada")
        self.show_conversation_summary()
    
    def coordinate_responses(self, question):
        """Coordina respuestas de todos los agentes por turnos"""
        print(f"\n📤 Enviando pregunta a todos los agentes...")
        print(f"❓ Pregunta: {question}")
        print("-" * 50)
        
        # Turno 1: Amazon Q (yo respondo primero)
        print("🔵 Turno 1: Amazon Q")
        amazonq_response = self.get_amazonq_response(question)
        print(f"🤖 Amazon Q: {amazonq_response}")
        self.responses_received["amazonq"] = amazonq_response
        
        # Turno 2: GitHub Copilot
        print(f"\n🟠 Turno 2: GitHub Copilot")
        print("📋 Copia la respuesta de Copilot y presiona Enter...")
        copilot_response = self.wait_for_agent_response("Copilot")
        self.responses_received["copilot"] = copilot_response
        
        # Turno 3: Gemini AI
        print(f"\n🟢 Turno 3: Gemini AI")
        gemini_response = self.get_gemini_response(question)
        print(f"🤖 Gemini: {gemini_response}")
        self.responses_received["gemini"] = gemini_response
        
        # Síntesis final
        print(f"\n🧠 Síntesis Colaborativa:")
        synthesis = self.generate_collaborative_synthesis()
        print(synthesis)
        
        # Guardar conversación
        self.save_conversation_turn(question)
        print("\n" + "=" * 50)
    
    def get_amazonq_response(self, question):
        """Genera respuesta de Amazon Q (mi respuesta)"""
        if "asistencia vial" in question.lower():
            return f"Para Asistencia Vial, sugiero enfocarnos en: 1) Optimizar geolocalización, 2) Mejorar UX del SOS, 3) Integrar notificaciones push. ¿Qué aspecto específico quieres desarrollar?"
        elif "sos" in question.lower():
            return f"El sistema SOS necesita: GPS ultra-rápido (<3s), botón de pánico visible, notificación automática a contactos, y integración con servicios de emergencia locales."
        else:
            return f"Analizando '{question}' en contexto de desarrollo web y mobile. Necesito más detalles para dar una respuesta específica."
    
    def wait_for_agent_response(self, agent_name):
        """Espera respuesta del agente copiada al portapapeles"""
        print(f"⏳ Esperando respuesta de {agent_name}...")
        print("📝 Instrucciones:")
        print(f"1. Ve al chat de {agent_name}")
        print(f"2. Haz tu pregunta: '{self.current_question}'")
        print("3. Copia la respuesta completa (Ctrl+A, Ctrl+C)")
        print("4. Vuelve aquí y presiona Enter")
        
        input("✅ Presiona Enter cuando hayas copiado la respuesta...")
        
        response = pyperclip.paste()
        if response and len(response) > 10:
            print(f"📥 Respuesta recibida de {agent_name} ({len(response)} caracteres)")
            return response
        else:
            print(f"⚠️  No se detectó respuesta válida de {agent_name}")
            return f"Sin respuesta de {agent_name}"
    
    def get_gemini_response(self, question):
        """Obtiene respuesta de Gemini AI via API"""
        try:
            api_key = "AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Contexto: Estamos desarrollando Asistencia Vial México, una app de emergencias viales. Pregunta: {question}"
                    }]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if 'candidates' in data and data['candidates']:
                return data['candidates'][0]['content']['parts'][0]['text']
            else:
                return "Gemini no pudo generar respuesta"
                
        except Exception as e:
            return f"Error conectando con Gemini: {str(e)}"
    
    def generate_collaborative_synthesis(self):
        """Genera síntesis colaborativa de todas las respuestas"""
        synthesis = f"""
🎯 SÍNTESIS COLABORATIVA PARA: "{self.current_question}"

🔵 Amazon Q (Análisis técnico):
{self.responses_received.get('amazonq', 'Sin respuesta')[:150]}...

🟠 GitHub Copilot (Implementación):
{self.responses_received.get('copilot', 'Sin respuesta')[:150]}...

🟢 Gemini AI (Estrategia):
{self.responses_received.get('gemini', 'Sin respuesta')[:150]}...

💡 RECOMENDACIÓN FINAL:
Combinando las tres perspectivas, la mejor aproximación para Asistencia Vial es:
1. Implementar la solución técnica de Amazon Q
2. Usar el código sugerido por Copilot
3. Aplicar la estrategia de Gemini
4. Priorizar impacto en usuarios reales

🚀 PRÓXIMO PASO: ¿Implementamos alguna de estas sugerencias?
"""
        return synthesis
    
    def save_conversation_turn(self, question):
        """Guarda turno de conversación"""
        turn = {
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'question': question,
            'responses': self.responses_received.copy()
        }
        self.conversation_log.append(turn)
    
    def show_conversation_summary(self):
        """Muestra resumen de la conversación"""
        print(f"\n📊 RESUMEN DE CONVERSACIÓN")
        print(f"Total de preguntas: {len(self.conversation_log)}")
        
        for i, turn in enumerate(self.conversation_log, 1):
            print(f"\n{i}. [{turn['timestamp']}]")
            print(f"   ❓ {turn['question']}")
            print(f"   🤖 Respuestas: {len(turn['responses'])} agentes")

if __name__ == "__main__":
    coordinator = MultiAgentCoordinator()
    coordinator.start_conversation()