# consolidar_salvame.ps1
# Arquitecto: DIOS | Implementador: Jorge Hernández

$ErrorActionPreference = "Stop"

Write-Host "🔄 CONSOLIDACIÓN DE VERSIONES SALVAME" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 1. Verificar versión oficial
$oficial = "M:\SALVAME"
if (-not (Test-Path $oficial)) {
    Write-Host "❌ ERROR: Versión oficial no encontrada" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Versión oficial encontrada: $oficial" -ForegroundColor Green

# 2. Crear respaldo
$fecha = Get-Date -Format "yyyyMMdd_HHmmss"
$backup = "F:\BACKUPS\salvame_consolidacion_$fecha"
New-Item -ItemType Directory -Path $backup -Force | Out-Null

Write-Host "📦 Creando respaldo en: $backup" -ForegroundColor Yellow

$versiones = @(
    "F:\NUEVO_COMIENZO\salvame",
    "F:\NUEVO_COMIENZO\salvame_main",
    "F:\NUEVO_COMIENZO\02_COMERCIAL\salvame",
    "F:\NUEVO_COMIENZO\entornos\salvame-specialized"
)

$i = 1
foreach ($version in $versiones) {
    if (Test-Path $version) {
        Write-Host "  Respaldando versión $i..." -ForegroundColor Yellow
        Copy-Item $version -Destination "$backup\salvame_v$i" -Recurse -Force
        Write-Host "  ✅ Versión $i respaldada" -ForegroundColor Green
    }
    $i++
}

# 3. Confirmar eliminación
Write-Host ""
Write-Host "⚠️ ADVERTENCIA: Se eliminarán 4 versiones antiguas" -ForegroundColor Yellow
Write-Host "Espacio a liberar: ~8 GB" -ForegroundColor Yellow
$confirmacion = Read-Host "¿Continuar? (SI/NO)"

if ($confirmacion -ne "SI") {
    Write-Host "❌ Operación cancelada" -ForegroundColor Red
    exit 0
}

# 4. Eliminar versiones antiguas
Write-Host "🗑️ Eliminando versiones antiguas..." -ForegroundColor Yellow

foreach ($version in $versiones) {
    if (Test-Path $version) {
        Remove-Item $version -Recurse -Force
        Write-Host "  ✅ Eliminado: $version" -ForegroundColor Green
    }
}

# 5. Crear symlink
Write-Host "🔗 Creando enlace simbólico..." -ForegroundColor Yellow
New-Item -ItemType SymbolicLink -Path "F:\NUEVO_COMIENZO\salvame" -Target $oficial -Force | Out-Null

Write-Host ""
Write-Host "✅ CONSOLIDACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "Versión oficial: M:\SALVAME" -ForegroundColor Cyan
Write-Host "Respaldo: $backup" -ForegroundColor Cyan
Write-Host "Espacio liberado: ~8 GB" -ForegroundColor Cyan
