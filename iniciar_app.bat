@echo off
title Adjudicaciones Continuas CV - Servidor Local
echo ========================================================
echo   Iniciando Servidor de Adjudicaciones Continuas CV
echo ========================================================
echo.
start "" http://localhost:3000
node server.js
pause
