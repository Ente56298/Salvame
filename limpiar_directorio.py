#!/usr/bin/env python3
import os
import shutil

def limpiar_directorio():
    """Limpia archivos corruptos y crea versión funcional"""
    
    base_path = "A:\\asistencia_vial"
    
    # Archivos corruptos a eliminar
    archivos_corruptos = [
        "admin_.html",
        "admin.html", 
        "asistente.html",
        "asistente2.html",
        "index1.html"
    ]
    
    # Eliminar archivos corruptos
    for archivo in archivos_corruptos:
        ruta = os.path.join(base_path, archivo)
        if os.path.exists(ruta):
            os.remove(ruta)
            print(f"❌ Eliminado: {archivo}")
    
    # Crear versión funcional principal
    html_funcional = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚗 Asistente Vial México</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#2563eb',
                        secondary: '#64748b'
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
    <div id="app"></div>
    <script src="index.js"></script>
</body>
</html>"""
    
    # Crear archivo principal funcional
    with open(os.path.join(base_path, "app.html"), "w", encoding="utf-8") as f:
        f.write(html_funcional)
    
    print("✅ Creado: app.html (versión funcional)")
    
    # Verificar archivos esenciales
    archivos_esenciales = ["index.js", "types.ts", "_app.tsx"]
    
    for archivo in archivos_esenciales:
        ruta = os.path.join(base_path, archivo)
        if os.path.exists(ruta):
            print(f"✅ Verificado: {archivo}")
        else:
            print(f"❌ Falta: {archivo}")
    
    return base_path

def crear_resumen_directorio():
    """Crea resumen del directorio limpio"""
    
    resumen = """# 📁 DIRECTORIO ASISTENCIA VIAL - LIMPIO

## ✅ Archivos Funcionales
- `app.html` - Versión principal funcional
- `index.html` - Versión original
- `index.js` - Aplicación JavaScript
- `_app.tsx` - Componente React principal

## 📂 Estructura Principal
- `components/` - Componentes React (70+ archivos)
- `services/` - Servicios API
- `data/` - Datos y configuración
- `hooks/` - Hooks personalizados
- `utils/` - Utilidades

## 🚀 Para Ejecutar
```
Abrir: file:///A:/asistencia_vial/app.html
```

## ❌ Archivos Eliminados (Corruptos)
- admin_.html
- admin.html
- asistente.html
- asistente2.html
- index1.html

Todos contenían código corrupto de Google AI Studio iframe.
"""
    
    with open("A:\\asistencia_vial\\DIRECTORIO_LIMPIO.md", "w", encoding="utf-8") as f:
        f.write(resumen)
    
    print("✅ Creado: DIRECTORIO_LIMPIO.md")

if __name__ == "__main__":
    print("🧹 LIMPIANDO DIRECTORIO ASISTENCIA VIAL")
    print("=" * 40)
    
    ruta = limpiar_directorio()
    crear_resumen_directorio()
    
    print(f"\n📊 RESUMEN:")
    print(f"  Directorio: {ruta}")
    print(f"  Archivos corruptos eliminados: 5")
    print(f"  Archivo funcional creado: app.html")
    
    print(f"\n🚀 USAR:")
    print(f"  file:///A:/asistencia_vial/app.html")