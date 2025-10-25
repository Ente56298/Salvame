@echo off
chcp 65001 >nul
echo ========================================
echo   DEPLOY A GITHUB - SALVAME
echo ========================================
echo.

set REPO_PATH=F:\PROYECTO_PRINCIPAL\ARCHIVOS_TRABAJO\asistencia_vial\salvame-deploy
set SOURCE_PATH=F:\PROYECTO_PRINCIPAL\ARCHIVOS_TRABAJO\asistencia_vial\asistencia_vial

echo [1/6] Creando estructura de repositorio...
if exist "%REPO_PATH%" rmdir /s /q "%REPO_PATH%"
mkdir "%REPO_PATH%"
cd /d "%REPO_PATH%"

echo.
echo [2/6] Copiando aplicacion compilada...
mkdir dist
xcopy "%SOURCE_PATH%\dist\*" "dist\" /E /I /Y 2>nul
if not exist "dist\index.html" (
    echo ERROR: Primero debes compilar la app
    echo Ejecuta: cd "%SOURCE_PATH%" ^&^& npm run build
    pause
    exit /b 1
)

echo.
echo [3/6] Creando README.md...
(
echo # 🚗 Salvame - Asistencia Vial Inteligente
echo.
echo ^> Plataforma movil con 4 agentes IA especializados para asistencia vial 24/7 en Mexico
echo.
echo [![Demo](https://img.shields.io/badge/Demo-Live-orange^)](https://ente56298.github.io/Salvame/^)
echo.
echo ## 🎯 El Problema
echo.
echo - **16,000+ muertes** anuales por accidentes viales en Mexico
echo - **$150,000M MXN** en perdidas economicas anuales
echo - **45 minutos** promedio de respuesta en emergencias
echo.
echo ## 💡 Nuestra Solucion
echo.
echo Plataforma movil con **4 agentes IA especializados** + **monitoreo 24/7**
echo.
echo ### 🚨 Agente Emergencias
echo Deteccion automatica de accidentes, llamada a servicios, ubicacion precisa
echo.
echo ### 🔧 Agente Mecanico
echo Diagnostico por sintomas, tutoriales AR, conexion con talleres
echo.
echo ### 👮 Agente Legal
echo Asesoria en accidentes, reportes legales, contacto con abogados
echo.
echo ### 🏥 Agente Medico
echo Primeros auxilios guiados, evaluacion de lesiones, ambulancias
echo.
echo ## 🚀 Demo en Vivo
echo.
echo **[👉 Probar App Ahora](https://ente56298.github.io/Salvame/^)**
echo.
echo ## 💻 Stack Tecnologico
echo.
echo - React + TypeScript
echo - Vite
echo - Tailwind CSS
echo - Google Gemini AI
echo - Geolocation API
echo.
echo ## 📊 Oportunidad de Mercado
echo.
echo ^| Metrica ^| Valor ^|
echo ^|------^|------^|
echo ^| **Mercado** ^| 50M conductores en Mexico ^|
echo ^| **TAM** ^| $60,000M MXN/año ^|
echo ^| **Usuarios Año 3** ^| 500,000 ^|
echo.
echo ## 📞 Contacto
echo.
echo **Jorge Armando Hernandez Saldivar**
echo Founder ^& CEO
echo.
echo ---
echo.
echo **🚗 Salvando vidas en las carreteras de Mexico**
) > README.md

echo.
echo [4/6] Creando .gitignore...
(
echo node_modules/
echo .env
echo .env.local
echo *.log
echo .DS_Store
) > .gitignore

echo.
echo [5/6] Inicializando Git...
git init
git add .
git commit -m "🚀 Deploy: Asistencia Vial MVP"

echo.
echo [6/6] Conectando con GitHub...
git branch -M main
git remote add origin https://github.com/Ente56298/Salvame.git

echo.
echo ========================================
echo   LISTO PARA PUSH
echo ========================================
echo.
echo Ejecuta manualmente:
echo   cd "%REPO_PATH%"
echo   git push -u origin main --force
echo.
echo Luego activa GitHub Pages:
echo   1. Ve a https://github.com/Ente56298/Salvame/settings/pages
echo   2. Source: Deploy from branch
echo   3. Branch: main / root
echo   4. Save
echo.
pause
