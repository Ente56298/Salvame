@echo off
title Asistente de Documentacion - Asistencia Vial Mexico
color 0B

:: Cargar configuracion central
call "%~dp0_config.bat"

:: Cambiar al directorio del proyecto de documentacion
cd /d "%DOCS_PROJECT_PATH%"
if errorlevel 1 (
    echo ❌ ERROR: El directorio del proyecto de documentacion no se encuentra en '%DOCS_PROJECT_PATH%'.
    pause
    exit
)

:menu
cls
echo ========================================
echo    ASISTENTE DE DOCUMENTACION
echo ========================================
echo.
echo Proyecto en: %CD%
echo.
echo Selecciona una opcion:
echo.
echo 1. Iniciar en modo Desarrollo
echo 2. Construir sitio estatico
echo 3. Instalar/Actualizar dependencias
echo 4. Desplegar en GitHub Pages
echo 5. Salir
echo.

set /p opcion="Ingresa tu opcion (1-5): "
if "%opcion%"=="1" goto dev
if "%opcion%"=="2" goto build
if "%opcion%"=="3" goto install
if "%opcion%"=="4" goto deploy
if "%opcion%"=="5" goto :eof

echo Opcion invalida.
pause
goto menu

:dev
echo Iniciando servidor de desarrollo de documentacion...
npm run docs:dev
goto end

:build
echo Construyendo sitio de documentacion...
npm run docs:build
goto end

:install
echo Instalando dependencias de documentacion...
npm install
goto end

:deploy
cls
echo ========================================
echo    CONFIRMACION DE DESPLIEGUE
echo ========================================
echo.
echo ⚠️  Estas a punto de desplegar el sitio de documentacion en GitHub Pages.
echo    Esta accion sobreescribira la version publica actual.
echo.
set /p confirm="Escribe 'desplegar' para confirmar y continuar: "

if /i not "%confirm%"=="desplegar" (
    echo.
    echo ❌ Despliegue cancelado.
    pause
    goto menu
)

echo.
echo Desplegando sitio de documentacion en GitHub Pages...
npm run deploy
echo.
echo ✅ Despliegue completado. Revisa la seccion 'Pages' en la configuracion de tu repositorio.
goto end

:end
echo.
echo Operacion finalizada.
pause
goto menu