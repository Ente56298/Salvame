@echo off
echo 🔧 Solucionando problema de Vite...

cd /d A:\asistencia_vial

echo ✅ Eliminando node_modules...
rmdir /s /q node_modules 2>nul

echo ✅ Eliminando package-lock.json...
del package-lock.json 2>nul

echo ✅ Reinstalando dependencias...
npm install

echo ✅ Instalando Vite específicamente...
npm install vite@latest @vitejs/plugin-react@latest --save-dev

echo ✅ Iniciando servidor...
npm run dev

pause