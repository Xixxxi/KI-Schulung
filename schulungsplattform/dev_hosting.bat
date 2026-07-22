@echo off
setlocal EnableDelayedExpansion

:: ─────────────────────────────────────────────────────────────────────────────
:: Schulungsplattform – Local-Host Starter (No-Admin)
:: - Installiert Backend-venv + Abhaengigkeiten
:: - Baut das React-Frontend (dist)
:: - Startet das Flask-Backend, das API + Frontend-Build ausliefert
:: Analog zu webapp\dev_hosting.bat der Haupt-Webapp.
:: ─────────────────────────────────────────────────────────────────────────────

set "APP_DIR=%~dp0"
set "BACKEND_DIR=%APP_DIR%backend"
set "FRONTEND_DIR=%APP_DIR%frontend"

set "VENV_DIR=%BACKEND_DIR%\.venv"
set "VENV_PYTHON=%VENV_DIR%\Scripts\python.exe"
set "VENV_PIP=%VENV_DIR%\Scripts\pip.exe"
set "BACKEND_REQ=%BACKEND_DIR%\requirements.txt"

echo.
echo ===============================================================
echo   Schulungsplattform ^| Hosting Mode
echo   API + Frontend unter einem Prozess (Port 8100)
echo ===============================================================
echo.

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [FEHLER] Python nicht gefunden.
    pause
    exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [FEHLER] Node.js nicht gefunden.
    pause
    exit /b 1
)

if not exist "%VENV_PYTHON%" (
    echo [INFO] Erstelle Backend-venv ...
    python -m venv "%VENV_DIR%"
    if !errorlevel! neq 0 (
        echo [FEHLER] venv konnte nicht erstellt werden.
        pause
        exit /b 1
    )
)

echo [INFO] Installiere/aktualisiere Backend-Abhaengigkeiten ...
"%VENV_PIP%" --isolated install --index-url https://pypi.org/simple --no-input -r "%BACKEND_REQ%"
if !errorlevel! neq 0 (
    echo [FEHLER] Backend requirements konnten nicht installiert werden.
    pause
    exit /b 1
)

echo [INFO] Installiere/aktualisiere Frontend-Abhaengigkeiten ...
cd /d "%FRONTEND_DIR%"
call npm install
if !errorlevel! neq 0 (
    echo [FEHLER] npm install fehlgeschlagen.
    pause
    exit /b 1
)

echo [INFO] Erstelle Frontend-Produktionsbuild ...
call npm run build
if !errorlevel! neq 0 (
    echo [FEHLER] Frontend build fehlgeschlagen.
    pause
    exit /b 1
)

echo.
echo [INFO] Pruefe Backend-Dateien ...
set "BACKEND_FILES_OK=1"
for %%F in (app.py) do (
    if not exist "%BACKEND_DIR%\%%F" (
        echo [FEHLER] Fehlende Backend-Datei: %BACKEND_DIR%\%%F
        set "BACKEND_FILES_OK=0"
    )
)
if "!BACKEND_FILES_OK!" == "0" (
    echo.
    echo [FEHLER] Mindestens eine Backend-Datei fehlt.
    pause
    exit /b 1
)
echo [OK] Alle Backend-Dateien vorhanden.

echo.
echo [INFO] Starte Hosting-Backend ...
echo [INFO] Lokal ueber: http://localhost:8100
echo [INFO] Beenden mit STRG+C
echo.

set "TRAINING_HOST=127.0.0.1"
set "TRAINING_PORT=8100"
set "TRAINING_USE_WAITRESS=1"

:: ── Beende verwaiste Prozesse auf Port 8100 ──────────────────────────────────
echo [INFO] Beende laufende Prozesse auf Port 8100 (falls vorhanden) ...
powershell -NoProfile -Command "$pids = (Get-NetTCPConnection -LocalPort 8100 -State Listen -ErrorAction SilentlyContinue).OwningProcess | Sort-Object -Unique | Where-Object { $_ -gt 0 }; foreach ($p in $pids) { Write-Host \"[INFO] Beende PID $p ...\"; Stop-Process -Id $p -Force -ErrorAction SilentlyContinue }; if ($pids) { Start-Sleep -Seconds 2 }"
echo [OK] Port 8100 bereit.

cd /d "%BACKEND_DIR%"
"%VENV_PYTHON%" "%BACKEND_DIR%\app.py"
if !errorlevel! neq 0 (
    echo.
    echo [FEHLER] Backend-Prozess mit Fehlercode !errorlevel! beendet.
)

echo.
echo [INFO] Hosting-Backend gestoppt.
pause
