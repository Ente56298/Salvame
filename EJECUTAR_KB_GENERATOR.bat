@echo off
title Generador de Base de Conocimiento CORA
echo.
echo 🚀 Generando Base de Conocimiento desde todos los archivos README.md...
echo ====================================================================
python "%~dp0crear_kb_readmes.py"
echo.
echo ✅ Base de Conocimiento generada en KNOWLEDGE_BASE_UNIFICADA.md y kb_readme_index.json
pause