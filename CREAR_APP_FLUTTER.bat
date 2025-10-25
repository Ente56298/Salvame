@echo off
title Crear App Flutter - Asistencia Vial Mexico
color 0A

echo ========================================
echo    CREAR APP FLUTTER LOCAL
echo    Asistencia Vial Mexico  
echo ========================================

cd /d A:\asistencia_vial

echo Configurando Flutter...
set FLUTTER_HOME=A:\asistencia_vial\flutter_sdk\flutter
set PATH=%FLUTTER_HOME%\bin;%PATH%

echo Verificando Flutter...
flutter doctor

echo Creando proyecto Flutter...
flutter create --org mx.asistenciavial --project-name asistente_vial_mexico flutter_app_local

cd flutter_app_local

echo Instalando dependencias...
flutter pub get

echo Proyecto creado en: A:\asistencia_vial\flutter_app_local

echo Para ejecutar:
echo cd flutter_app_local
echo flutter run

pause