@echo off
title Asistencia Vial Mexico - Web App
color 0A

echo ========================================
echo    ASISTENCIA VIAL MEXICO
echo    Aplicacion Web - Inicio Rapido
echo ========================================

cd /d A:\asistencia_vial

echo Instalando dependencias...
npm install

echo Iniciando servidor web...
echo.
echo La aplicacion estara disponible en:
echo http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev