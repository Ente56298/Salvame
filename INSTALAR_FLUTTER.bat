@echo off
title Instalador Flutter - Asistencia Vial Mexico
color 0A

echo ========================================
echo    INSTALADOR FLUTTER AUTOMATICO
echo    Asistencia Vial Mexico
echo ========================================

cd /d A:\asistencia_vial

echo 1. Descargando Flutter SDK...
if not exist flutter_sdk (
    echo Creando directorio flutter_sdk...
    mkdir flutter_sdk
)

cd flutter_sdk

echo Descargando Flutter desde GitHub...
curl -L -o flutter_windows.zip https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.16.0-stable.zip

echo 2. Extrayendo Flutter...
powershell -command "Expand-Archive -Path flutter_windows.zip -DestinationPath . -Force"

echo 3. Configurando variables de entorno...
set FLUTTER_HOME=A:\asistencia_vial\flutter_sdk\flutter
set PATH=%FLUTTER_HOME%\bin;%PATH%

echo 4. Verificando instalacion...
%FLUTTER_HOME%\bin\flutter doctor

echo 5. Configurando Flutter...
%FLUTTER_HOME%\bin\flutter config --no-analytics
%FLUTTER_HOME%\bin\flutter precache

echo ========================================
echo    FLUTTER INSTALADO CORRECTAMENTE
echo ========================================

echo Para usar Flutter en esta sesion:
echo set PATH=A:\asistencia_vial\flutter_sdk\flutter\bin;%%PATH%%
echo flutter doctor

echo Para uso permanente, agrega a PATH del sistema:
echo A:\asistencia_vial\flutter_sdk\flutter\bin

pause