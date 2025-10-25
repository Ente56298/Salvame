@echo off
title Asistencia Vial Mexico - Inicio Rapido
color 0A

echo.
echo ========================================
echo    ASISTENCIA VIAL MEXICO
echo    Inicio Rapido del Sistema
echo ========================================
echo.

cd /d A:\asistencia_vial

echo Verificando instalacion...
if not exist package.json (
    echo Proyecto no encontrado
    echo Ejecutando instalador automatico...
    python INSTALADOR_AUTOMATICO.py
    pause
    exit
)

echo Proyecto encontrado

echo.
echo Selecciona una opcion:
echo 1. Iniciar desarrollo (Frontend + Backend)
echo 2. Solo Frontend
echo 3. Solo Backend  
echo 4. Construir proyecto
echo 5. Instalar/Actualizar dependencias
echo 6. Configurar Android
echo 7. Salir
echo.

set /p opcion="Ingresa tu opcion (1-7): "

if "%opcion%"=="1" goto desarrollo
if "%opcion%"=="2" goto frontend
if "%opcion%"=="3" goto backend
if "%opcion%"=="4" goto build
if "%opcion%"=="5" goto install
if "%opcion%"=="6" goto android
if "%opcion%"=="7" goto salir

:desarrollo
echo Iniciando desarrollo completo...
start "Backend API" cmd /k "npm run dev:backend"
timeout /t 3
start "Frontend React" cmd /k "npm run dev"
echo Servicios iniciados en modo desarrollo
goto fin

:frontend
echo Iniciando solo Frontend...
npm run dev
goto fin

:backend
echo Iniciando solo Backend...
npm run dev:backend
goto fin

:build
echo Construyendo proyecto...
npm run build
echo Construccion completada
goto fin

:install
echo Instalando dependencias...
npm install
echo Dependencias actualizadas
goto fin

:android
echo Configurando Android...
npx cap sync android
echo Android sincronizado
goto fin

:salir
echo Saliendo...
exit

:fin
echo.
echo Operacion completada
pause