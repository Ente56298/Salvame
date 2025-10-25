import time
import pyperclip
import threading
from datetime import datetime

class SimpleChatReader:
    def __init__(self):
        self.last_clipboard = ""
        self.responses = []
        self.running = True
        
    def monitor_clipboard(self):
        """Monitorea portapapeles para respuestas copiadas"""
        print("🤖 Monitor de Chat Colaborativo Iniciado")
        print("📋 Copia respuestas de Copilot/Gemini para procesarlas")
        print("⏹️  Ctrl+C para detener\n")
        
        while self.running:
            try:
                current_clipboard = pyperclip.paste()
                
                if (current_clipboard and 
                    current_clipboard != self.last_clipboard and 
                    len(current_clipboard) > 20):  # Filtrar texto muy corto
                    
                    self.last_clipboard = current_clipboard
                    self.process_response(current_clipboard)
                
                time.sleep(1)  # Revisar cada segundo
                
            except KeyboardInterrupt:
                self.running = False
                break
            except Exception as e:
                print(f"❌ Error: {e}")
                time.sleep(2)
    
    def process_response(self, response):
        """Procesa respuesta de agente y genera síntesis"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        # Detectar tipo de agente por contenido
        agent_type = self.detect_agent(response)
        
        print(f"\n🔍 [{timestamp}] Respuesta detectada de {agent_type}")
        print(f"📝 Contenido: {response[:100]}...")
        
        # Guardar respuesta
        self.responses.append({
            'agent': agent_type,
            'content': response,
            'timestamp': timestamp
        })
        
        # Generar síntesis colaborativa
        synthesis = self.generate_synthesis(response, agent_type)
        print(f"\n🧠 Síntesis Colaborativa:")
        print(f"{synthesis}")
        print("-" * 60)
        
    def detect_agent(self, text):
        """Detecta qué agente generó la respuesta"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['copilot', 'github', 'código', 'implementar']):
            return "GitHub Copilot"
        elif any(word in text_lower for word in ['gemini', 'google', 'considera', 'puedes']):
            return "Gemini AI"
        elif any(word in text_lower for word in ['cora', 'co•ra', 'habitantes', 'intención']):
            return "CO•RA"
        else:
            return "Agente Desconocido"
    
    def generate_synthesis(self, response, agent_type):
        """Genera síntesis colaborativa basada en la respuesta"""
        
        if agent_type == "GitHub Copilot":
            return f"""
🔧 ANÁLISIS TÉCNICO (basado en Copilot):
{response[:200]}...

💡 MI SÍNTESIS PARA ASISTENCIA VIAL:
- Implementar las sugerencias de código de Copilot
- Adaptar a la arquitectura React existente
- Priorizar optimización de performance
- Integrar con sistema de geolocalización actual
"""
        
        elif agent_type == "Gemini AI":
            return f"""
🧠 ANÁLISIS ESTRATÉGICO (basado en Gemini):
{response[:200]}...

💡 MI SÍNTESIS PARA ASISTENCIA VIAL:
- Considerar las ideas innovadoras de Gemini
- Evaluar viabilidad técnica y comercial
- Integrar con roadmap de producto
- Validar con usuarios reales
"""
        
        elif agent_type == "CO•RA":
            return f"""
🌟 ANÁLISIS ÉTICO (basado en CO•RA):
{response[:200]}...

💡 MI SÍNTESIS PARA ASISTENCIA VIAL:
- Aplicar principios éticos de CO•RA
- Priorizar bienestar real del usuario
- Mantener intención pura del proyecto
- Alinear con propósito superior
"""
        
        else:
            return f"""
🤔 ANÁLISIS GENERAL:
{response[:200]}...

💡 MI SÍNTESIS PARA ASISTENCIA VIAL:
- Evaluar aplicabilidad al proyecto
- Considerar impacto en usuarios
- Integrar con desarrollo actual
"""
    
    def show_summary(self):
        """Muestra resumen de respuestas procesadas"""
        if self.responses:
            print(f"\n📊 RESUMEN DE SESIÓN:")
            print(f"Total respuestas procesadas: {len(self.responses)}")
            
            for i, resp in enumerate(self.responses[-3:], 1):  # Últimas 3
                print(f"{i}. [{resp['timestamp']}] {resp['agent']}")
        else:
            print("\n📊 No se procesaron respuestas en esta sesión")

if __name__ == "__main__":
    reader = SimpleChatReader()
    
    try:
        reader.monitor_clipboard()
    except KeyboardInterrupt:
        print("\n\n⏹️  Deteniendo monitor...")
        reader.running = False
        reader.show_summary()
        print("👋 Chat colaborativo finalizado")