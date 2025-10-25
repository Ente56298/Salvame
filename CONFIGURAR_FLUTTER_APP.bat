@echo off
title Configurar App Flutter - Asistencia Vial Mexico
color 0A

echo ========================================
echo    CONFIGURAR APP FLUTTER
echo    Asistencia Vial Mexico
echo ========================================

cd /d A:\asistencia_vial

echo Verificando si existe flutter_app...
if not exist flutter_app (
    echo ERROR: Directorio flutter_app no encontrado
    echo.
    echo Por favor:
    echo 1. Descarga el codigo desde Rocket.new
    echo 2. Extrae el ZIP en flutter_app/
    echo 3. Ejecuta este script nuevamente
    echo.
    pause
    exit
)

echo Directorio flutter_app encontrado

cd flutter_app

echo Configurando Flutter para esta sesion...
set FLUTTER_HOME=A:\asistencia_vial\flutter_sdk\flutter
set PATH=%FLUTTER_HOME%\bin;%PATH%

echo Verificando Flutter...
if exist "%FLUTTER_HOME%\bin\flutter.bat" (
    echo Flutter encontrado en: %FLUTTER_HOME%
    %FLUTTER_HOME%\bin\flutter doctor
) else (
    echo Flutter no encontrado. Instalando...
    cd /d A:\asistencia_vial
    call SOLUCION_FLUTTER.bat
    cd flutter_app
)

echo Instalando dependencias del proyecto...
flutter pub get

echo Verificando proyecto...
flutter analyze

echo ========================================
echo    CONFIGURACION COMPLETADA
echo ========================================

echo Para ejecutar la app:
echo flutter run

echo Para ejecutar en web:
echo flutter run -d chrome

echo Para construir APK:
echo flutter build apk

pause