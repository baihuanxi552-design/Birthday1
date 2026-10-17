@echo off
setlocal
cd /d "%~dp0"
echo 510 Birthday Press Conference - Development
echo Open the Local URL shown below. Keep this window open.
call npm.cmd run dev -- --port 5173
pause
