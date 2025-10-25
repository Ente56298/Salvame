@echo off
title Menu Principal - Asistencia Vial Mexico
color 0A

:: Cargar configuracion y asegurar que estamos en el directorio raíz
call "%~dp0_config.bat"
cd /d "%PROJECT_ROOT%"

:menu
cls
echo ========================================
echo    ASISTENCIA VIAL MEXICO
echo    Menu Principal del Sistema
echo ========================================
echo.
echo Selecciona una opcion:
echo.
echo 1. Asistente Web (React/Node.js)
echo 2. Asistente Movil (Flutter)
echo 3. Generar Base de Conocimiento (KB)
echo 4. Asistente de Documentacion
echo 5. Herramientas Avanzadas y Mantenimiento
echo 6. Salir
echo.

set /p opcion="Ingresa tu opcion (1-6): "

if "%opcion%"=="1" goto web
if "%opcion%"=="2" goto flutter_helper
if "%opcion%"=="3" goto kb
if "%opcion%"=="4" goto docs_helper
if "%opcion%"=="5" goto advanced_tools
if "%opcion%"=="6" goto salir

echo Opcion invalida. Presiona cualquier tecla...
pause > nul
goto menu

:web
echo Iniciando aplicacion web...
call WEB_HELPER.bat
goto menu

:flutter_helper
echo Abriendo asistente de app movil...
call FLUTTER_HELPER.bat
goto menu

:kb
echo Generando Base de Conocimiento...
call EJECUTAR_KB_GENERATOR.bat
goto menu

:docs_helper
echo Abriendo asistente de documentacion...
call DOCS_HELPER.bat
goto menu

:salir
echo ✅ Saliendo del sistema...
exit

:advanced_tools
cls
echo ========================================
echo    HERRAMIENTAS AVANZADAS
echo ========================================
echo.
echo 1. Analizar calidad de codigo (Web)
echo 2. Analizar calidad de codigo (Flutter)
echo 3. Auditar dependencias (Web)
echo 4. Limpieza profunda del proyecto
echo 5. Actualizar dependencias (Web)
echo 6. Volver al menu principal
echo.
set /p adv_opcion="Ingresa tu opcion (1-6): "

if "%adv_opcion%"=="1" goto lint_web
if "%adv_opcion%"=="2" goto lint_flutter
if "%adv_opcion%"=="3" goto audit_web
if "%adv_opcion%"=="4" goto deep_clean
if "%adv_opcion%"=="5" goto update_web_deps
if "%adv_opcion%"=="6" goto menu

echo Opcion invalida.
pause
goto advanced_tools

:lint_web
echo.
echo --- Analizando calidad de codigo del proyecto Web (npm run lint) ---
npm run lint
pause
goto advanced_tools

:lint_flutter
echo.
echo --- Analizando calidad de codigo del proyecto Flutter (flutter analyze) ---
cd /d "%PROJECT_ROOT%flutter_app"
flutter analyze
cd /d "%PROJECT_ROOT%"
pause
goto advanced_tools

:audit_web
echo.
echo --- Auditando dependencias del proyecto Web (npm audit / outdated) ---
echo.
echo --- [ VULNERABILIDADES (npm audit) ] ---
npm audit
echo.
echo --- [ PAQUETES DESACTUALIZADOS (npm outdated) ] ---
npm outdated
pause
goto advanced_tools

:deep_clean
echo.
echo --- Realizando limpieza profunda del proyecto ---
echo Eliminando artefactos del proyecto Web...
rmdir /s /q node_modules 2>nul
rmdir /s /q dist 2>nul
rmdir /s /q .vite 2>nul
del package-lock.json 2>nul
echo Eliminando artefactos del proyecto Flutter...
rmdir /s /q "%PROJECT_ROOT%flutter_app\.dart_tool" 2>nul
rmdir /s /q "%PROJECT_ROOT%flutter_app\.idea" 2>nul
rmdir /s /q "%PROJECT_ROOT%flutter_app\build" 2>nul
echo Eliminando artefactos del proyecto de documentacion...
rmdir /s /q "%DOCS_PROJECT_PATH%\node_modules" 2>nul
rmdir /s /q "%DOCS_PROJECT_PATH%\.vitepress\dist" 2>nul
echo.
echo ✅ Limpieza completada. Ejecuta 'npm install' y 'flutter pub get' para reinstalar.
pause
goto advanced_tools

:update_web_deps
echo.
echo --- Actualizando dependencias del proyecto Web ---
echo Verificando si 'npm-check-updates' esta instalado...
npm list -g npm-check-updates >nul 2>nul
if errorlevel 1 (
    echo 'npm-check-updates' no encontrado. Instalando globalmente...
    npm install -g npm-check-updates
) else (
    echo 'npm-check-updates' ya esta instalado.
)
echo.
echo Ejecutando 'ncu -u' para actualizar package.json...
ncu -u
echo.
echo Reinstalando dependencias con 'npm install'...
npm install
echo.
echo ✅ Dependencias actualizadas.
pause
goto advanced_tools