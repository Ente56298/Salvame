@echo off
REM Arquitecto: DIOS | Implementador: Jorge Hernández
REM Script de inicio rápido para preparar lanzamiento Google Play

echo ========================================
echo   SALVAME - PREPARACION GOOGLE PLAY
echo ========================================
echo.

cd /d F:\PROYECTO_PRINCIPAL\ARCHIVOS_TRABAJO\asistencia_vial

echo [1/6] Instalando dependencias Capacitor...
call npm install @capacitor/core @capacitor/cli @capacitor/android

echo.
echo [2/6] Inicializando Capacitor...
call npx cap init Salvame mx.salvame.app --web-dir=dist

echo.
echo [3/6] Agregando plataforma Android...
call npx cap add android

echo.
echo [4/6] Construyendo version de produccion...
call npm run build

echo.
echo [5/6] Sincronizando con Android...
call npx cap sync android

echo.
echo [6/6] Abriendo Android Studio...
call npx cap open android

echo.
echo ========================================
echo   PREPARACION COMPLETADA
echo ========================================
echo.
echo PROXIMOS PASOS:
echo 1. En Android Studio: Build ^> Generate Signed Bundle/APK
echo 2. Crear keystore si no existe
echo 3. Generar AAB firmado
echo 4. Subir a Google Play Console
echo.
echo Consulta GOOGLE_PLAY_LAUNCH.md para guia completa
echo.
pause
