import json
import re
from datetime import datetime, timedelta
from collections import defaultdict
import tkinter as tk
from tkinter import scrolledtext

class ContextualAssistant:
    def __init__(self):
        # Contexto persistente
        self.context = {
            'projects': {
                'tenancingo_live': {'status': 'completed', 'value': 5000, 'currency': 'MXN', 'client_waiting': True},
                'asistencia_vial': {'status': 'deployed', 'users': 0, 'viral_ready': True, 'thread_ready': True},
                'catalogos': {'status': 'active', 'components': 25}
            },
            'user_patterns': defaultdict(int),
            'priorities': ['cobrar_tenancingo', 'viral_asistencia', 'consolidar_cora'],
            'conversation_history': []
        }
        
        # NLP patterns
        self.intent_patterns = {
            'status_query': [r'estado', r'cómo va', r'progreso', r'situación'],
            'payment_reminder': [r'cobrar', r'dinero', r'pago', r'tenancingo'],
            'viral_action': [r'viral', r'twitter', r'thread', r'publicar'],
            'metrics_request': [r'métricas', r'números', r'estadísticas', r'analytics'],
            'next_action': [r'qué sigue', r'próximo', r'siguiente', r'hacer ahora']
        }
        
        # UI
        self.setup_ui()
        
    def setup_ui(self):
        self.root = tk.Tk()
        self.root.title("🧠 Asistente Contextual CO•RA")
        self.root.geometry("800x600")
        self.root.configure(bg='#0d1117')
        
        # Chat area
        self.chat_area = scrolledtext.ScrolledText(
            self.root, bg='#0d1117', fg='#c9d1d9', 
            font=('Consolas', 11), wrap=tk.WORD
        )
        self.chat_area.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Input
        self.input_entry = tk.Entry(
            self.root, bg='#21262d', fg='#c9d1d9', 
            font=('Arial', 12), insertbackground='#c9d1d9'
        )
        self.input_entry.pack(fill='x', padx=10, pady=5)
        self.input_entry.bind('<Return>', self.process_input)
        
        # Inicializar
        self.log("🧠 Asistente Contextual CO•RA iniciado")
        self.log("Entiendo tu contexto de proyectos y prioridades")
        self.show_current_context()
        
    def process_input(self, event):
        user_input = self.input_entry.get().strip()
        if not user_input:
            return
            
        self.input_entry.delete(0, tk.END)
        self.log(f"👤 {user_input}")
        
        # Analizar intención con NLP
        intent = self.analyze_intent(user_input)
        
        # Generar respuesta contextual
        response = self.generate_contextual_response(user_input, intent)
        
        # Actualizar contexto
        self.update_context(user_input, intent)
        
        self.log(f"🧠 {response}")
        
    def analyze_intent(self, text):
        text_lower = text.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text_lower):
                    return intent
                    
        return 'general_query'
        
    def generate_contextual_response(self, user_input, intent):
        if intent == 'status_query':
            return self.get_status_summary()
            
        elif intent == 'payment_reminder':
            return self.get_payment_reminder()
            
        elif intent == 'viral_action':
            return self.get_viral_action()
            
        elif intent == 'metrics_request':
            return self.get_metrics_summary()
            
        elif intent == 'next_action':
            return self.get_next_action()
            
        else:
            return self.get_contextual_general_response(user_input)
            
    def get_status_summary(self):
        tenancingo = self.context['projects']['tenancingo_live']
        asistencia = self.context['projects']['asistencia_vial']
        
        return f"""📊 ESTADO ACTUAL:

💰 Tenancingo Live: COMPLETADO
   • Cliente revisando sistema
   • ${tenancingo['value']} {tenancingo['currency']} pendiente
   • Acción: Seguimiento para aprobación

🚗 Asistencia Vial: DEPLOYADO
   • URL: https://asistencia-vial.vercel.app
   • Thread viral listo para publicar
   • Acción: Viralizar para conseguir usuarios

🎯 Prioridad #1: Cobrar Tenancingo Live"""
   
    def get_payment_reminder(self):
        return """💰 RECORDATORIO TENANCINGO LIVE:

✅ Sistema completado y funcionando
✅ Cliente tiene acceso completo
✅ Todas las funcionalidades operativas

🎯 ACCIÓN INMEDIATA:
Contactar cliente para:
1. Confirmar satisfacción con el sistema
2. Solicitar aprobación final
3. Proceder con cobro de $5,000 MXN

⏰ Tiempo transcurrido: Cliente revisando desde entrega"""

    def get_viral_action(self):
        return """🚀 THREAD VIRAL ASISTENCIA VIAL:

📄 Thread preparado en: TWITTER_THREAD_LISTO.txt
🎯 8 tweets con datos impactantes
📊 17,000 muertes anuales - dato brutal
🇲🇽 Enfoque mexicano diferenciado

⚡ ACCIÓN INMEDIATA:
1. Abrir @AsistenciVialMX
2. Copiar tweet 1/8 del archivo
3. Publicar como hilo
4. Horario óptimo: 8-10 PM México

🎯 Objetivo: Conseguir primeros usuarios reales"""

    def get_metrics_summary(self):
        return """📈 MÉTRICAS ECOSISTEMA:

📊 VOLUMEN:
• 2,277,706 archivos totales
• 150+ proyectos identificados
• 42K+ archivos documentación

💰 VALOR ECONÓMICO:
• Inmediato: $5K MXN (Tenancingo)
• Potencial: $50K+ USD (ecosistema)
• Impacto: 17K vidas/año (Asistencia Vial)

🎯 CONVERSIÓN:
• Tenancingo: 100% completado
• Asistencia Vial: 95% listo para viral
• CO•RA: Memoria activada y funcionando"""

    def get_next_action(self):
        priority = self.context['priorities'][0]
        
        if priority == 'cobrar_tenancingo':
            return """🎯 PRÓXIMA ACCIÓN PRIORITARIA:

💰 COBRAR TENANCINGO LIVE
• Contactar cliente inmediatamente
• Confirmar satisfacción con sistema
• Solicitar aprobación y pago $5K MXN
• Tiempo estimado: 1-2 días

🚀 DESPUÉS:
• Publicar thread viral Asistencia Vial
• Conseguir primeros usuarios
• Monetizar ecosistema CO•RA"""

        return "Analizando prioridades actuales..."
        
    def get_contextual_general_response(self, user_input):
        # Respuesta contextual basada en patrones
        if 'cora' in user_input.lower():
            return "🧠 CO•RA está funcionando con memoria activada. Ecosistema robusto con 150+ proyectos identificados."
            
        elif any(word in user_input.lower() for word in ['dinero', 'económico', 'monetizar']):
            return "💰 Situación económica: $5K MXN pendiente Tenancingo + potencial $50K+ USD ecosistema completo."
            
        elif 'tiempo' in user_input.lower():
            return "⏰ Timing crítico: Cliente Tenancingo esperando, thread viral listo, momento óptimo para consolidar."
            
        return f"Entiendo tu consulta sobre '{user_input}'. ¿Te refieres a algún proyecto específico?"
        
    def update_context(self, user_input, intent):
        # Actualizar patrones de usuario
        self.context['user_patterns'][intent] += 1
        
        # Guardar en historial
        self.context['conversation_history'].append({
            'timestamp': datetime.now().isoformat(),
            'input': user_input,
            'intent': intent
        })
        
        # Mantener solo últimas 50 conversaciones
        if len(self.context['conversation_history']) > 50:
            self.context['conversation_history'] = self.context['conversation_history'][-50:]
            
    def show_current_context(self):
        context_summary = f"""🧠 CONTEXTO ACTUAL CARGADO:

📊 PROYECTOS ACTIVOS:
• Tenancingo Live: Completado, $5K MXN pendiente
• Asistencia Vial: Deployado, thread viral listo
• Catalogos: 25 componentes activos
• CO•RA: Memoria activada

🎯 PRIORIDADES:
1. Cobrar Tenancingo Live
2. Viralizar Asistencia Vial  
3. Consolidar ecosistema CO•RA

💡 Pregúntame sobre estado, métricas, próximas acciones o cualquier proyecto específico."""

        self.log(context_summary)
        
    def log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        self.chat_area.insert(tk.END, f"[{timestamp}] {message}\n\n")
        self.chat_area.see(tk.END)
        self.root.update()
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    assistant = ContextualAssistant()
    assistant.run()