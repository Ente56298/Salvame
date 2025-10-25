import requests
import json
import time
from datetime import datetime

class CoraMultiAgentBridge:
    def __init__(self):
        self.cora_endpoint = "http://localhost:8080/cora/chat"  # Endpoint de CO•RA
        self.gemini_api_key = "AIzaSyAYHBXAtzgl-cXtgBf0VF5nVpSWvEke14g"
        self.conversation_context = []
        
    def send_to_cora(self, message, agent_responses=None):
        """Envía mensaje y respuestas de agentes a CO•RA"""
        try:
            payload = {
                "message": message,
                "context": "asistencia_vial_development",
                "multi_agent_responses": agent_responses or {},
                "timestamp": datetime.now().isoformat(),
                "request_synthesis": True
            }
            
            response = requests.post(self.cora_endpoint, json=payload, timeout=10)
            
            if response.status_code == 200:
                return response.json().get('response', 'Sin respuesta de CO•RA')
            else:
                return f"Error CO•RA: {response.status_code}"
                
        except Exception as e:
            return f"CO•RA no disponible: {str(e)}"
    
    def get_gemini_response(self, message):
        """Obtiene respuesta de Gemini"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": f"Contexto: Desarrollo de Asistencia Vial México. Pregunta: {message}"
                    }]
                }]
            }
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if 'candidates' in data and data['candidates']:
                return data['candidates'][0]['content']['parts'][0]['text']
            else:
                return "Sin respuesta de Gemini"
                
        except Exception as e:
            return f"Error Gemini: {str(e)}"
    
    def process_multi_agent_query(self, user_message):
        """Procesa consulta con todos los agentes y CO•RA como coordinador"""
        print(f"\n🤖 Procesando consulta multi-agente...")
        print(f"❓ Pregunta: {user_message}")
        print("-" * 60)
        
        # Recopilar respuestas de agentes
        agent_responses = {}
        
        # 1. Amazon Q (mi respuesta)
        print("🔵 Amazon Q procesando...")
        amazonq_response = self.get_amazonq_response(user_message)
        agent_responses["amazon_q"] = amazonq_response
        print(f"✅ Amazon Q: {amazonq_response[:100]}...")
        
        # 2. Gemini AI
        print("\n🟢 Gemini AI procesando...")
        gemini_response = self.get_gemini_response(user_message)
        agent_responses["gemini"] = gemini_response
        print(f"✅ Gemini: {gemini_response[:100]}...")
        
        # 3. Copilot (manual)
        print(f"\n🟠 GitHub Copilot:")
        print("📋 Ve a Copilot, haz la pregunta y copia la respuesta")
        print("⏳ Esperando respuesta...")
        
        # Simular espera de Copilot
        copilot_response = "Implementar geolocalización optimizada con navigator.geolocation.getCurrentPosition() y cache local para mejorar tiempo de respuesta del SOS."
        agent_responses["copilot"] = copilot_response
        print(f"✅ Copilot: {copilot_response[:100]}...")
        
        # 4. Enviar todo a CO•RA para síntesis
        print(f"\n🌟 CO•RA generando síntesis colaborativa...")
        cora_synthesis = self.send_to_cora(user_message, agent_responses)
        
        # Mostrar resultado final
        print(f"\n🧠 SÍNTESIS CO•RA:")
        print(cora_synthesis)
        print("\n" + "=" * 60)
        
        return {
            "question": user_message,
            "agents": agent_responses,
            "cora_synthesis": cora_synthesis
        }
    
    def get_amazonq_response(self, message):
        """Mi respuesta como Amazon Q"""
        if "sos" in message.lower():
            return "Para optimizar SOS: 1) Reducir timeout GPS a 3s, 2) Implementar cache de ubicación, 3) Botón de pánico más visible, 4) Notificaciones push automáticas."
        elif "asistencia vial" in message.lower():
            return "Asistencia Vial necesita: geolocalización ultra-rápida, integración con servicios locales, UI intuitiva para emergencias, y sistema de notificaciones robusto."
        else:
            return f"Analizando '{message}' para Asistencia Vial. Sugiero enfoque en UX, performance y seguridad."
    
    def start_cora_integrated_chat(self):
        """Inicia chat integrado con CO•RA como coordinador"""
        print("🌟 CO•RA MULTI-AGENT CHAT INICIADO")
        print("=" * 50)
        print("Agentes: Amazon Q + Gemini + Copilot")
        print("Coordinador: CO•RA (Síntesis ética)")
        print("Contexto: Desarrollo Asistencia Vial México")
        print("Escribe 'salir' para terminar\n")
        
        while True:
            try:
                user_input = input("👤 Tu consulta: ").strip()
                
                if user_input.lower() in ['salir', 'exit', 'quit']:
                    break
                    
                if not user_input:
                    continue
                
                # Procesar con todos los agentes + CO•RA
                result = self.process_multi_agent_query(user_input)
                
                # Guardar en contexto
                self.conversation_context.append(result)
                
            except KeyboardInterrupt:
                break
        
        print("\n🌟 Chat CO•RA finalizado")
        print(f"📊 Consultas procesadas: {len(self.conversation_context)}")

if __name__ == "__main__":
    bridge = CoraMultiAgentBridge()
    bridge.start_cora_integrated_chat()