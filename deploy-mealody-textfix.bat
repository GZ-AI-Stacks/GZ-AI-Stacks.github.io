@echo off
echo Kopiere korrigierten Mealody-Text...
copy /Y "%~dp0..\Homepage-v2\public\mealody\index.html" "%~dp0mealody\index.html"

cd /d "%~dp0"
git add mealody\index.html
git commit -m "Mealody: verbotenen Verkaufsbegriff ersetzt (fuer immer -> jederzeit)"
git push

echo.
echo Fertig. Fenster schliesst sich in 5 Sekunden.
timeout /t 5
