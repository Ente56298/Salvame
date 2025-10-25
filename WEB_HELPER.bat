@echo off
title Asistente Web - Asistencia Vial Mexico
color 0A

:: Cargar configuracion central y cambiar al directorio del proyecto
call "%~dp0_config.bat"
cd /d "%PROJECT_ROOT%"

:: Comprobar si se paso un argumento (ej: WEB_HELPER.bat dev)
if not "%~1"=="" (
    set "arg=%~1"
    if /i "%arg%"=="dev" goto dev
    if /i "%arg%"=="frontend" goto frontend
    if /i "%arg%"=="backend" goto backend
    if /i "%arg%"=="install" goto install
    if /i "%arg%"=="build" goto build
    if /i "%arg%"=="preview" goto preview
    if /i "%arg%"=="android" goto android
    if /i "%arg%"=="vite_fix" goto vite_fix
    
    echo ❌ Argumento invalido: '%arg%'. Mostrando menu...
    pause
)

:menu
cls
echo ========================================
echo    ASISTENTE WEB (REACT) - ASISTENCIA VIAL
echo ========================================
echo.
echo Proyecto en: %PROJECT_ROOT%
echo.
echo Selecciona una opcion:
echo.
echo 1. Iniciar en modo Desarrollo (Frontend + Backend)
echo 2. Iniciar solo Frontend
echo 3. Iniciar solo Backend
echo 4. Instalar/Actualizar dependencias (npm install)
echo 5. Construir para produccion (npm run build)
echo 6. Construir y Previsualizar para produccion
echo 7. Sincronizar con Android (Capacitor)
echo 8. Solucionar problemas de Vite (reinstalar todo)
echo 9. Salir
echo.

set /p opcion="Ingresa tu opcion (1-9): "
if "%opcion%"=="1" goto dev
if "%opcion%"=="2" goto frontend
if "%opcion%"=="3" goto backend
if "%opcion%"=="4" goto install
if "%opcion%"=="5" goto build
if "%opcion%"=="6" goto preview
if "%opcion%"=="7" goto android
if "%opcion%"=="8" goto vite_fix
if "%opcion%"=="9" goto :eof

echo Opcion invalida.
pause
goto menu

:dev
echo Iniciando desarrollo completo...
echo.
echo 1. Iniciando Backend API en una nueva ventana...
start "Backend API" cmd /k "npm run dev:backend"
echo 2. Iniciando Frontend React en una nueva ventana...
start "Frontend React" cmd /k "npm run dev"
goto end

:frontend
echo Iniciando solo Frontend...
npm run dev
goto end

:backend
echo Iniciando solo Backend...
npm run dev:backend
goto end

:install
echo Instalando/actualizando dependencias...
npm install
goto end

:build
echo Construyendo proyecto para produccion...
npm run build
goto end

:preview
echo Construyendo proyecto para produccion...
npm run build
echo.
echo Iniciando servidor de previsualizacion...
npm run preview
goto end

:android
echo Sincronizando con Android (Capacitor)...
npx cap sync android
goto end

:vite_fix
echo Solucionando problemas de Vite...
echo Eliminando node_modules y package-lock.json...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
echo Reinstalando dependencias...
npm install
echo.
echo ✅ Proceso completado. Intenta iniciar el servidor de nuevo.
goto end

:end
echo.
echo Operacion finalizada.
pause
goto menu