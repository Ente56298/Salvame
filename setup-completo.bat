@echo off
echo ========================================
echo    ASISTENCIA VIAL MEXICO
echo    Configuracion Completa
echo ========================================

cd /d A:\asistencia_vial

echo.
echo 1. Instalando dependencias principales...
npm install

echo.
echo 2. Instalando dependencias de desarrollo...
npm install --save-dev vite @vitejs/plugin-react typescript tailwindcss postcss autoprefixer

echo.
echo 3. Verificando instalacion...
npm run build

echo.
echo 4. Creando archivo de entorno...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado - Configura tus API keys
)

echo.
echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
echo Para iniciar el proyecto:
echo   npm run dev
echo.
echo Para construir para produccion:
echo   npm run build
echo.
pause