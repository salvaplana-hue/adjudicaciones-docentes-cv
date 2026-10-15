@echo off
chcp 65001 > nul
echo ===================================================================
echo             DESPLIEGUE AUTOMÁTICO A VERCEL
echo ===================================================================
echo.
echo Este script subirá la aplicación a la nube de Vercel.
echo.
echo Pasos a seguir:
echo 1. Si no has iniciado sesión, te pedirá identificarte (puedes usar GitHub o tu Email).
echo 2. Responde a las preguntas del asistente pulsando ENTER para aceptar los valores por defecto:
echo    - Set up and deploy? [Y/n] -> Pulsa ENTER
echo    - Which scope? -> Selecciona tu cuenta y pulsa ENTER
echo    - Link to existing project? [y/N] -> Pulsa ENTER (N)
echo    - What's your project's name? -> Pulsa ENTER
echo    - In which directory is your code located? -> Pulsa ENTER
echo.
echo ===================================================================
pause
echo.
echo Conectando con Vercel...
echo.
call npx vercel
echo.
echo ===================================================================
echo ¿Deseas publicarlo directamente en Producción (Dominio definitivo)?
echo Si es así, pulsa cualquier tecla para desplegar con "--prod".
echo De lo contrario, cierra esta ventana.
echo ===================================================================
pause
call npx vercel --prod
pause
