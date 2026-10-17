@echo off
setlocal
cd /d "%~dp0"
echo 510 Birthday Press Conference - Preview
echo Open the Local URL shown below. Keep this window open.
call npm.cmd run preview -- --port 4173
pause
