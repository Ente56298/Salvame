#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Iniciando build para Android...');

// 1. Build React app
console.log('📦 Building React app...');
execSync('npm run build', { stdio: 'inherit' });

// 2. Add Capacitor Android platform
console.log('🤖 Adding Android platform...');
try {
  execSync('npx cap add android', { stdio: 'inherit' });
} catch (e) {
  console.log('Android platform already exists');
}

// 3. Copy web assets
console.log('📋 Copying web assets...');
execSync('npx cap copy android', { stdio: 'inherit' });

// 4. Sync Capacitor
console.log('🔄 Syncing Capacitor...');
execSync('npx cap sync android', { stdio: 'inherit' });

// 5. Open Android Studio
console.log('🎯 Opening Android Studio...');
execSync('npx cap open android', { stdio: 'inherit' });

console.log('✅ Build completado. Usa Android Studio para generar APK/AAB');
console.log('📱 Para release: Build > Generate Signed Bundle/APK');