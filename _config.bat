@echo off
:: ==========================================================================
:: Archivo de Configuracion Central para los scripts de Asistencia Vial
:: ==========================================================================

:: Ruta base del proyecto. %~dp0 se expande a la carpeta del script que lo llama.
set "PROJECT_ROOT=%~dp0"

:: Ruta de instalacion para el SDK de Flutter.
set "FLUTTER_SDK_PATH=%PROJECT_ROOT%flutter_sdk"
set "FLUTTER_HOME=%FLUTTER_SDK_PATH%\flutter"

:: Ruta para el proyecto de documentacion.
set "DOCS_PROJECT_PATH=%PROJECT_ROOT%docs_site"