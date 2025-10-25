@echo off
title Asistente Flutter - Asistencia Vial Mexico
color 0A

:: Cargar configuracion central
call "%~dp0_config.bat"

:: Establecer la ruta de Flutter para esta sesion
set "PATH=%FLUTTER_HOME%\bin;%PATH%"

:: Comprobar si se paso un argumento (ej: FLUTTER_HELPER.bat install)
if "%~1" neq "" (
    goto %1
)

:menu
cls
echo ========================================
echo    ASISTENTE FLUTTER - ASISTENCIA VIAL
echo ========================================
echo.
echo SDK de Flutter esperado en: %FLUTTER_HOME%
echo.
echo Selecciona una opcion:
echo.
echo 1. Instalar/Actualizar Flutter SDK
echo 2. Verificar instalacion (flutter doctor)
echo 3. Crear nuevo proyecto Flutter local
echo 4. Construir APK para Android
echo 5. Abrir terminal con entorno Flutter
echo 6. Salir
echo.

set /p opcion="Ingresa tu opcion (1-6): "
if "%opcion%"=="1" goto install
if "%opcion%"=="2" goto doctor
if "%opcion%"=="3" goto create
if "%opcion%"=="4" goto build_apk
if "%opcion%"=="5" goto shell
if "%opcion%"=="6" goto :eof

echo Opcion invalida.
pause
goto menu

:install
echo.
echo --- 1. Instalando Flutter SDK ---
if exist "%FLUTTER_HOME%\bin\flutter.bat" (
    echo Flutter ya parece estar instalado.
) else (
    echo Descargando Flutter SDK...
    mkdir "%FLUTTER_SDK_PATH%" 2>nul
    powershell -Command "Invoke-WebRequest -Uri 'https://storage.googleapis.com/flutter_infra_release/releases/stable/windows/flutter_windows_3.16.0-stable.zip' -OutFile '%FLUTTER_SDK_PATH%\flutter.zip'"
    echo Extrayendo Flutter...
    powershell -Command "Expand-Archive -Path '%FLUTTER_SDK_PATH%\flutter.zip' -DestinationPath '%FLUTTER_SDK_PATH%' -Force"
    del "%FLUTTER_SDK_PATH%\flutter.zip"
)
echo.
goto doctor

:doctor
echo.
echo --- 2. Verificando instalacion (flutter doctor) ---
flutter doctor
echo.
echo Para uso permanente, agrega a la variable de entorno PATH del sistema:
echo %FLUTTER_HOME%\bin
echo.
pause
goto menu

:create
echo.
echo --- 3. Creando nuevo proyecto Flutter ---
set /p project_name="Nombre del proyecto (ej: mi_app_flutter): "
if "%project_name%"=="" goto create
flutter create --org mx.asistenciavial "%project_name%"
echo.
echo ✅ Proyecto '%project_name%' creado.
pause
goto menu

:build_apk
echo.
echo --- 4. Construyendo APK para Android ---
set /p project_path="Ingresa el nombre del directorio del proyecto Flutter: "
if "%project_path%"=="" (
    echo Nombre de directorio invalido.
    pause
    goto menu
)

if not exist "%PROJECT_ROOT%%project_path%\pubspec.yaml" (
    echo ERROR: No se encontro un proyecto Flutter en '%PROJECT_ROOT%%project_path%'.
    echo Asegurate de que el nombre del directorio es correcto.
    pause
    goto menu
)

cd /d "%PROJECT_ROOT%%project_path%"
echo Construyendo APK de release...
flutter build apk --release
echo.
echo ✅ APK de release construido.
echo Lo puedes encontrar en: %CD%\build\app\outputs\flutter-apk\app-release.apk
cd /d "%PROJECT_ROOT%"
pause
goto menu

:shell
echo.
echo --- 5. Abriendo terminal con entorno Flutter ---
echo El entorno de Flutter esta configurado en esta ventana.
echo Puedes navegar a tu proyecto (ej: cd mi_app_flutter) y usar comandos como 'flutter run'.
cmd /k
goto menu