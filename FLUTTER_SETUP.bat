@echo off
title Flutter Setup - Asistencia Vial Mexico

echo Configurando Flutter para esta sesion...
set FLUTTER_HOME=A:\asistencia_vial\flutter_sdk\flutter
set PATH=%FLUTTER_HOME%\bin;%PATH%

echo Flutter configurado. Comandos disponibles:
echo - flutter doctor
echo - flutter create proyecto
echo - flutter run
echo - flutter build apk

cmd /k