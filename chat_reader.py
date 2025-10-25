import time
import pyautogui
import pyperclip
from selenium import webdriver
from selenium.webdriver.common.by import By
import requests
import json

class ChatReader:
    def __init__(self):
        self.driver = None
        self.last_message = ""
        
    def setup_browser(self):
        """Configura navegador para leer chats"""
        options = webdriver.ChromeOptions()
        options.add_argument("--user-data-dir=C:/Users/jorge/AppData/Local/Google/Chrome/User Data")
        self.driver = webdriver.Chrome(options=options)
        
    def read_copilot_response(self):
        """Lee respuesta de GitHub Copilot"""
        try:
            # Buscar último mensaje de Copilot
            messages = self.driver.find_elements(By.CLASS_NAME, "copilot-message")
            if messages:
                latest = messages[-1].text
                if latest != self.last_message:
                    self.last_message = latest
                    return latest
        except:
            pass
        return None
        
    def read_gemini_response(self):
        """Lee respuesta de Gemini"""
        try:
            messages = self.driver.find_elements(By.CLASS_NAME, "gemini-response")
            if messages:
                return messages[-1].text
        except:
            pass
        return None
        
    def read_clipboard_response(self):
        """Lee respuesta copiada al portapapeles"""
        try:
            # Simular Ctrl+A, Ctrl+C para copiar respuesta
            pyautogui.hotkey('ctrl', 'a')
            time.sleep(0.1)
            pyautogui.hotkey('ctrl', 'c')
            time.sleep(0.1)
            
            clipboard_content = pyperclip.paste()
            if clipboard_content and clipboard_content != self.last_message:
                self.last_message = clipboard_content
                return clipboard_content
        except:
            pass
        return None
        
    def send_to_amazonq(self, message):
        """Envía mensaje procesado a Amazon Q"""
        # Aquí enviarías el mensaje a Amazon Q
        print(f"Enviando a Amazon Q: {message}")
        
    def process_collaborative_response(self, copilot_msg, gemini_msg):
        """Procesa respuestas colaborativas"""
        if copilot_msg or gemini_msg:
            synthesis = f"""
Síntesis Colaborativa:

Copilot sugiere: {copilot_msg[:100] if copilot_msg else 'Sin respuesta'}...

Gemini aporta: {gemini_msg[:100] if gemini_msg else 'Sin respuesta'}...

Mi análisis: Combinando ambas respuestas para Asistencia Vial...
"""
            self.send_to_amazonq(synthesis)
            
    def monitor_chat(self):
        """Monitorea chat continuamente"""
        print("Monitoreando respuestas de agentes...")
        
        while True:
            try:
                # Leer respuestas de diferentes agentes
                copilot_response = self.read_copilot_response()
                gemini_response = self.read_gemini_response()
                clipboard_response = self.read_clipboard_response()
                
                # Procesar si hay nuevas respuestas
                if copilot_response or gemini_response or clipboard_response:
                    self.process_collaborative_response(
                        copilot_response or clipboard_response, 
                        gemini_response
                    )
                
                time.sleep(2)  # Revisar cada 2 segundos
                
            except KeyboardInterrupt:
                print("Deteniendo monitor...")
                break
            except Exception as e:
                print(f"Error: {e}")
                time.sleep(5)

if __name__ == "__main__":
    reader = ChatReader()
    reader.setup_browser()
    reader.monitor_chat()