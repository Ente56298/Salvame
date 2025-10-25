import tkinter as tk
from tkinter import ttk
import threading
import time
import requests
import json
import os
from datetime import datetime, timedelta

class PersonalAssistant:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("🤖 Asistente Personal CO•RA")
        self.root.geometry("900x700")
        self.root.configure(bg='#1a1a1a')
        
        # Notebook para tabs
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill='both', expand=True, padx=10, pady=10)
        
        # Tabs
        self.create_dashboard_tab()
        self.create_projects_tab()
        self.create_reminders_tab()
        self.create_analytics_tab()
        
        # Estado
        self.projects = {
            'tenancingo_live': {'status': 'completed', 'value': 5000, 'client_waiting': True},
            'asistencia_vial': {'status': 'deployed', 'users': 0, 'viral_ready': True},
            'catalogos': {'status': 'active', 'components': 25}
        }
        
        # Inicializar
        self.start_monitoring()
        
    def create_dashboard_tab(self):
        dashboard = ttk.Frame(self.notebook)
        self.notebook.add(dashboard, text="📊 Dashboard")
        
        # Status proyectos
        status_frame = tk.Frame(dashboard, bg='#2d2d2d')
        status_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Label(status_frame, text="🎯 ESTADO PROYECTOS", 
                bg='#2d2d2d', fg='#ffffff', font=('Arial', 14, 'bold')).pack()
        
        self.status_text = tk.Text(status_frame, height=8, bg='#1a1a1a', fg='#00ff00', 
                                  font=('Consolas', 10))
        self.status_text.pack(fill='x', padx=10, pady=5)
        
        # Acciones rápidas
        actions_frame = tk.Frame(dashboard, bg='#2d2d2d')
        actions_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Label(actions_frame, text="⚡ ACCIONES RÁPIDAS", 
                bg='#2d2d2d', fg='#ffffff', font=('Arial', 14, 'bold')).pack()
        
        buttons_frame = tk.Frame(actions_frame, bg='#2d2d2d')
        buttons_frame.pack(pady=10)
        
        tk.Button(buttons_frame, text="💰 Cobrar Tenancingo", bg='#00aa00', fg='white',
                 command=self.remind_tenancingo_payment).pack(side='left', padx=5)
        
        tk.Button(buttons_frame, text="🚀 Publicar Thread", bg='#1da1f2', fg='white',
                 command=self.publish_viral_thread).pack(side='left', padx=5)
        
        tk.Button(buttons_frame, text="📊 Ver Métricas", bg='#ff6b35', fg='white',
                 command=self.show_metrics).pack(side='left', padx=5)
        
    def create_projects_tab(self):
        projects = ttk.Frame(self.notebook)
        self.notebook.add(projects, text="🚀 Proyectos")
        
        self.projects_text = tk.Text(projects, bg='#1a1a1a', fg='#ffffff', 
                                    font=('Consolas', 10))
        self.projects_text.pack(fill='both', expand=True, padx=10, pady=10)
        
    def create_reminders_tab(self):
        reminders = ttk.Frame(self.notebook)
        self.notebook.add(reminders, text="⏰ Recordatorios")
        
        # Input para nuevos recordatorios
        input_frame = tk.Frame(reminders, bg='#2d2d2d')
        input_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Label(input_frame, text="Nuevo recordatorio:", 
                bg='#2d2d2d', fg='#ffffff').pack(anchor='w')
        
        self.reminder_entry = tk.Entry(input_frame, bg='#1a1a1a', fg='#ffffff', 
                                      font=('Arial', 11))
        self.reminder_entry.pack(fill='x', pady=5)
        self.reminder_entry.bind('<Return>', self.add_reminder)
        
        # Lista de recordatorios
        self.reminders_text = tk.Text(reminders, bg='#1a1a1a', fg='#ffffff', 
                                     font=('Consolas', 10))
        self.reminders_text.pack(fill='both', expand=True, padx=10, pady=10)
        
    def create_analytics_tab(self):
        analytics = ttk.Frame(self.notebook)
        self.notebook.add(analytics, text="📈 Analytics")
        
        self.analytics_text = tk.Text(analytics, bg='#1a1a1a', fg='#ffffff', 
                                     font=('Consolas', 10))
        self.analytics_text.pack(fill='both', expand=True, padx=10, pady=10)
        
    def start_monitoring(self):
        # Actualizar dashboard cada 30s
        threading.Thread(target=self.monitor_projects, daemon=True).start()
        
        # Recordatorios cada minuto
        threading.Thread(target=self.check_reminders, daemon=True).start()
        
        # Actualización inicial
        self.update_dashboard()
        self.update_projects()
        self.update_analytics()
        
    def monitor_projects(self):
        while True:
            self.update_dashboard()
            time.sleep(30)
            
    def update_dashboard(self):
        status = f"""🎯 ESTADO PROYECTOS - {datetime.now().strftime('%H:%M:%S')}
{'='*50}

💰 TENANCINGO LIVE
   Estado: ✅ COMPLETADO Y FUNCIONANDO
   URL: https://tenancingolive.byethost17.com/
   Cliente: 🔄 Revisando sistema
   Valor: $5,000 MXN pendiente
   Acción: Seguimiento para aprobación

🚗 ASISTENCIA VIAL MÉXICO  
   Estado: ✅ DEPLOYADO
   URL: https://asistencia-vial.vercel.app
   Twitter: @AsistenciVialMX
   Usuarios: {self.projects['asistencia_vial']['users']} activos
   Acción: Publicar thread viral

📚 CATALOGOS GENERATOR
   Estado: ✅ ACTIVO
   Componentes: {self.projects['catalogos']['components']}
   Tecnología: React + TypeScript + Gemini
   Acción: Expandir marketplace

🧠 ECOSISTEMA CO•RA
   Estado: ✅ MEMORIA ACTIVADA
   Proyectos: 150+ identificados
   Documentación: Completa
   Acción: Consolidar valor
"""
        
        self.status_text.delete(1.0, tk.END)
        self.status_text.insert(1.0, status)
        
    def update_projects(self):
        projects_info = f"""🚀 ANÁLISIS DETALLADO DE PROYECTOS
{'='*60}

📊 MÉTRICAS CONSOLIDADAS:
• Total archivos: 2,277,706
• Proyectos activos: 4 principales
• Valor estimado: $50,000+ USD
• Tiempo desarrollo: 2+ años

🎯 PRIORIDADES INMEDIATAS:
1. Cobrar Tenancingo Live ($5K MXN)
2. Viralizar Asistencia Vial (thread listo)
3. Monetizar Catalogos Generator
4. Consolidar ecosistema CO•RA

💡 OPORTUNIDADES:
• Asistencia Vial: Modelo freemium $50-200/mes
• B2B flotas: $500-2K/mes por empresa
• Gobierno: Licencias municipales
• Internacional: Expansión LatAm

⚠️ RIESGOS:
• Competencia copiando ideas
• Presión económica personal
• Tiempo limitado para consolidar
"""
        
        self.projects_text.delete(1.0, tk.END)
        self.projects_text.insert(1.0, projects_info)
        
    def update_analytics(self):
        analytics_info = f"""📈 ANALYTICS Y MÉTRICAS
{'='*50}

🎯 TENANCINGO LIVE:
• Completado: 100%
• Funcionalidades: Todas operativas
• Cliente: Esperando feedback
• Próximo: Cobro $5K MXN

📱 ASISTENCIA VIAL:
• Deploy: ✅ Vercel
• Features: SOS <3s, GPS optimizado
• Thread viral: Listo para publicar
• Potencial: 17K vidas/año

🧠 CO•RA ECOSYSTEM:
• Memoria: Activada y funcionando
• Documentación: 42K+ archivos MD
• Filosofía: Singularidad ética
• Estado: Robusto y productivo

💰 VALOR ECONÓMICO:
• Inmediato: $5K MXN (Tenancingo)
• Potencial: $50K+ USD (ecosistema)
• Impacto: Incalculable (vidas salvadas)
"""
        
        self.analytics_text.delete(1.0, tk.END)
        self.analytics_text.insert(1.0, analytics_info)
        
    def remind_tenancingo_payment(self):
        self.show_notification("💰 RECORDATORIO", 
                              "Contactar cliente Tenancingo Live para aprobación final y cobro de $5,000 MXN")
        
    def publish_viral_thread(self):
        self.show_notification("🚀 THREAD VIRAL", 
                              "Thread listo en TWITTER_THREAD_LISTO.txt - Copiar y publicar en @AsistenciVialMX")
        
    def show_metrics(self):
        self.notebook.select(3)  # Cambiar a tab Analytics
        
    def add_reminder(self, event):
        reminder = self.reminder_entry.get().strip()
        if reminder:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
            self.reminders_text.insert(tk.END, f"[{timestamp}] {reminder}\n")
            self.reminder_entry.delete(0, tk.END)
            
    def check_reminders(self):
        while True:
            # Recordatorios automáticos
            now = datetime.now()
            
            # Recordatorio diario Tenancingo
            if now.hour == 9 and now.minute == 0:
                self.show_notification("💰 TENANCINGO", "Seguimiento cliente - $5K MXN pendiente")
                
            # Recordatorio viral Asistencia Vial
            if now.hour == 20 and now.minute == 0:  # 8 PM - hora pico Twitter
                self.show_notification("🚀 VIRAL", "Hora pico Twitter - Publicar thread Asistencia Vial")
                
            time.sleep(60)  # Check cada minuto
            
    def show_notification(self, title, message):
        # Ventana de notificación
        notification = tk.Toplevel(self.root)
        notification.title(title)
        notification.geometry("400x150")
        notification.configure(bg='#2d2d2d')
        notification.attributes('-topmost', True)
        
        tk.Label(notification, text=title, bg='#2d2d2d', fg='#ffffff', 
                font=('Arial', 12, 'bold')).pack(pady=10)
        
        tk.Label(notification, text=message, bg='#2d2d2d', fg='#ffffff', 
                font=('Arial', 10), wraplength=350).pack(pady=10)
        
        tk.Button(notification, text="Entendido", bg='#00aa00', fg='white',
                 command=notification.destroy).pack(pady=10)
        
        # Auto-cerrar en 10 segundos
        notification.after(10000, notification.destroy)
        
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    assistant = PersonalAssistant()
    assistant.run()