@echo off
title Solucion Flutter - Asistencia Vial Mexico
color 0A

echo ========================================
echo    SOLUCION FLUTTER COMPLETA
echo    Asistencia Vial Mexico
echo ========================================

cd /d A:\asistencia_vial

echo 1. Descargando Flutter SDK...
mkdir flutter_sdk 2>nul
cd flutter_sdk

echo Descargando Flutter...
powershell -command "Invoke-WebRequest -Uri 'https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.16.0-stable.zip' -OutFile 'flutter.zip'"

echo Extrayendo Flutter...
powershell -command "Expand-Archive -Path flutter.zip -DestinationPath . -Force"

echo 2. Configurando Flutter...
set FLUTTER_HOME=%CD%\flutter
set PATH=%FLUTTER_HOME%\bin;%PATH%

echo 3. Verificando Flutter...
%FLUTTER_HOME%\bin\flutter doctor

echo 4. Creando proyecto Flutter local...
cd /d A:\asistencia_vial
%FLUTTER_HOME%\bin\flutter create --org mx.asistenciavial flutter_app_local

echo 5. Configurando proyecto...
cd flutter_app_local
%FLUTTER_HOME%\bin\flutter pub get

echo ========================================
echo    FLUTTER CONFIGURADO CORRECTAMENTE
echo ========================================

echo Para usar Flutter:
echo 1. Abre una nueva ventana de CMD
echo 2. Ejecuta: set PATH=A:\asistencia_vial\flutter_sdk\flutter\bin;%%PATH%%
echo 3. Ve a: cd A:\asistencia_vial\flutter_app_local
echo 4. Ejecuta: flutter run

echo.
echo ALTERNATIVA - Usar aplicacion web:
echo cd A:\asistencia_vial
echo npm run dev

pause