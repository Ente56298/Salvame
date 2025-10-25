@echo off
echo ========================================
echo   DESPLIEGUE ASISTENCIA VIAL
echo ========================================
echo.

cd /d "F:\PROYECTO_PRINCIPAL\ARCHIVOS_TRABAJO\asistencia_vial\asistencia_vial"

echo [1/4] Instalando dependencias...
call npm install

echo.
echo [2/4] Compilando aplicacion...
call npm run build

echo.
echo [3/4] Verificando build...
if exist "dist" (
    echo Build exitoso! Archivos en /dist
) else (
    echo ERROR: Build fallo
    pause
    exit /b 1
)

echo.
echo [4/4] Opciones de despliegue:
echo.
echo 1. Vercel (Recomendado)
echo 2. Netlify
echo 3. GitHub Pages
echo 4. Preview local
echo.

set /p opcion="Selecciona opcion (1-4): "

if "%opcion%"=="1" goto vercel
if "%opcion%"=="2" goto netlify
if "%opcion%"=="3" goto github
if "%opcion%"=="4" goto preview

:vercel
echo.
echo Desplegando a Vercel...
call npx vercel --prod
goto end

:netlify
echo.
echo Desplegando a Netlify...
call npx netlify deploy --prod --dir=dist
goto end

:github
echo.
echo Preparando para GitHub Pages...
echo Copia el contenido de /dist a tu repositorio
echo y activa GitHub Pages en Settings
pause
goto end

:preview
echo.
echo Iniciando preview local...
call npm run preview
goto end

:end
echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
pause
