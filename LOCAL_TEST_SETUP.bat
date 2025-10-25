@echo off
echo 🚀 Configurando Asistencia Vial para pruebas locales...

cd /d A:\asistencia_vial

echo ✅ Instalando dependencias...
npm install

echo ✅ Verificando estructura...
if not exist "src" mkdir src
if not exist "components" echo ✅ Components folder exists
if not exist "utils" echo ✅ Utils folder exists

echo ✅ Iniciando servidor de desarrollo...
npm run dev

pause