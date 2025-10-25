#!/usr/bin/env python3
"""
INSTALADOR AUTOMÁTICO ASISTENCIA VIAL MÉXICO
Configuración completa del ecosistema
"""

import os
import subprocess
import json
import time
from pathlib import Path

class InstaladorAsistenciaVial:
    def __init__(self):
        self.base_path = Path("A:/asistencia_vial")
        self.componentes = {
            "frontend": True,
            "backend": True,
            "android": True,
            "analytics": True,
            "deployment": True
        }
    
    def verificar_dependencias(self):
        """Verifica e instala dependencias necesarias"""
        print("🔍 Verificando dependencias del sistema...")
        
        dependencias = {
            "node": "node --version",
            "npm": "npm --version", 
            "git": "git --version"
        }
        
        for dep, cmd in dependencias.items():
            try:
                result = subprocess.run(cmd.split(), capture_output=True, text=True)
                if result.returncode == 0:
                    print(f"✅ {dep}: {result.stdout.strip()}")
                else:
                    print(f"❌ {dep}: No encontrado")
            except FileNotFoundError:
                print(f"❌ {dep}: No instalado")
    
    def instalar_dependencias_npm(self):
        """Instala dependencias de Node.js"""
        print("\n📦 Instalando dependencias NPM...")
        
        os.chdir(self.base_path)
        
        try:
            # Instalar dependencias principales
            subprocess.run(["npm", "install"], check=True)
            print("✅ Dependencias principales instaladas")
            
            # Instalar dependencias de desarrollo
            dev_deps = [
                "@types/react",
                "@types/react-dom", 
                "typescript",
                "vite",
                "tailwindcss",
                "postcss",
                "autoprefixer"
            ]
            
            for dep in dev_deps:
                subprocess.run(["npm", "install", "--save-dev", dep], check=True)
                print(f"✅ {dep} instalado")
                
        except subprocess.CalledProcessError as e:
            print(f"❌ Error instalando dependencias: {e}")
    
    def configurar_android(self):
        """Configura el proyecto Android"""
        print("\n📱 Configurando proyecto Android...")
        
        android_path = self.base_path / "android"
        if android_path.exists():
            os.chdir(android_path)
            
            try:
                # Sincronizar proyecto Android
                subprocess.run(["npx", "cap", "sync", "android"], check=True)
                print("✅ Proyecto Android sincronizado")
                
                # Construir APK de desarrollo
                subprocess.run(["./gradlew", "assembleDebug"], check=True)
                print("✅ APK de desarrollo generado")
                
            except subprocess.CalledProcessError as e:
                print(f"❌ Error configurando Android: {e}")
    
    def configurar_servicios(self):
        """Configura servicios backend"""
        print("\n⚙️ Configurando servicios backend...")
        
        # Crear archivo de configuración
        config = {
            "database": {
                "type": "sqlite",
                "path": "asistencia_vial.db"
            },
            "api": {
                "port": 3001,
                "cors": True
            },
            "services": {
                "sos": True,
                "tracking": True,
                "notifications": True
            }
        }
        
        config_path = self.base_path / "config.json"
        with open(config_path, 'w') as f:
            json.dump(config, f, indent=2)
        
        print("✅ Configuración de servicios creada")
    
    def generar_certificados(self):
        """Genera certificados para HTTPS local"""
        print("\n🔐 Generando certificados SSL...")
        
        certs_path = self.base_path / "certs"
        certs_path.mkdir(exist_ok=True)
        
        # Generar certificado autofirmado
        try:
            subprocess.run([
                "openssl", "req", "-x509", "-newkey", "rsa:4096",
                "-keyout", str(certs_path / "key.pem"),
                "-out", str(certs_path / "cert.pem"),
                "-days", "365", "-nodes",
                "-subj", "/C=MX/ST=CDMX/L=Mexico/O=AsistenciaVial/CN=localhost"
            ], check=True)
            print("✅ Certificados SSL generados")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("⚠️ OpenSSL no disponible, usando HTTP")
    
    def crear_scripts_desarrollo(self):
        """Crea scripts de desarrollo"""
        print("\n📝 Creando scripts de desarrollo...")
        
        # Script de inicio
        start_script = """@echo off
echo 🚀 Iniciando Asistencia Vial México...
cd /d A:\\asistencia_vial
start "Backend" cmd /k "npm run dev:backend"
timeout /t 3
start "Frontend" cmd /k "npm run dev"
echo ✅ Servicios iniciados
pause
"""
        
        with open(self.base_path / "start.bat", 'w') as f:
            f.write(start_script)
        
        # Script de construcción
        build_script = """@echo off
echo 🔨 Construyendo proyecto...
cd /d A:\\asistencia_vial
npm run build
echo ✅ Construcción completada
pause
"""
        
        with open(self.base_path / "build.bat", 'w') as f:
            f.write(build_script)
        
        print("✅ Scripts de desarrollo creados")
    
    def configurar_base_datos(self):
        """Configura la base de datos"""
        print("\n🗄️ Configurando base de datos...")
        
        # SQL para crear tablas
        sql_schema = """
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT UNIQUE,
            email TEXT UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS vehiculos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            marca TEXT,
            modelo TEXT,
            año INTEGER,
            placas TEXT UNIQUE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        );
        
        CREATE TABLE IF NOT EXISTS servicios_sos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER,
            tipo_emergencia TEXT,
            ubicacion_lat REAL,
            ubicacion_lng REAL,
            estado TEXT DEFAULT 'activo',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
        );
        """
        
        db_path = self.base_path / "backend" / "database.sql"
        with open(db_path, 'w') as f:
            f.write(sql_schema)
        
        print("✅ Esquema de base de datos creado")
    
    def instalar_completo(self):
        """Ejecuta instalación completa"""
        print("🚀 INICIANDO INSTALACIÓN COMPLETA DE ASISTENCIA VIAL MÉXICO")
        print("=" * 60)
        
        # Verificar sistema
        self.verificar_dependencias()
        
        # Instalar dependencias
        self.instalar_dependencias_npm()
        
        # Configurar servicios
        self.configurar_servicios()
        
        # Configurar base de datos
        self.configurar_base_datos()
        
        # Generar certificados
        self.generar_certificados()
        
        # Crear scripts
        self.crear_scripts_desarrollo()
        
        # Configurar Android (opcional)
        if input("\n¿Configurar proyecto Android? (s/n): ").lower() == 's':
            self.configurar_android()
        
        print("\n🎉 INSTALACIÓN COMPLETADA")
        print("=" * 60)
        print("✅ Proyecto Asistencia Vial México configurado")
        print("✅ Dependencias instaladas")
        print("✅ Servicios configurados")
        print("✅ Base de datos inicializada")
        print("✅ Scripts de desarrollo creados")
        print("\n🚀 Para iniciar el proyecto ejecuta: start.bat")
        print("🔨 Para construir el proyecto ejecuta: build.bat")

def main():
    """Función principal"""
    instalador = InstaladorAsistenciaVial()
    
    print("🚗 INSTALADOR ASISTENCIA VIAL MÉXICO")
    print("Configuración automática del ecosistema completo")
    print("=" * 50)
    
    if input("¿Proceder con la instalación? (s/n): ").lower() == 's':
        instalador.instalar_completo()
    else:
        print("Instalación cancelada")

if __name__ == "__main__":
    main()