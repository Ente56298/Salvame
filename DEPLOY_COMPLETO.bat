@echo off
REM Arquitecto: DIOS | Implementador: Jorge Hernandez
echo ========================================
echo   DESPLIEGUE COMPLETO - SALVAME
echo ========================================
echo.

echo [1/6] Instalando dependencias...
call npm install
if errorlevel 1 goto error

echo.
echo [2/6] Limpiando build anterior...
if exist dist rmdir /s /q dist

echo.
echo [3/6] Construyendo produccion...
call npm run build
if errorlevel 1 goto error

echo.
echo [4/6] Verificando build...
if not exist dist\index.html goto error

echo.
echo [5/6] Desplegando a Vercel...
call vercel --prod
if errorlevel 1 goto error

echo.
echo [6/6] Abriendo dashboards...
start "" "deployment\cost-analysis-dashboard.html"
start "" "marketing\landing-olvido.html"
start "" "marketing\qr-generator.html"

echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo URLs:
echo - App: https://salvame.vercel.app
echo - Landing: https://salvame.mx/olvido
echo - Dashboard: Local
echo.
pause
exit

:error
echo.
echo ========================================
echo   ERROR EN DESPLIEGUE
echo ========================================
echo.
pause
exit /b 1
