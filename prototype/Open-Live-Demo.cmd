@echo off
rem Double-click to open live Luna chat using the local .env key.
powershell.exe -NoProfile -File "%~dp0Start-Live-Demo.ps1"
if errorlevel 1 pause
