@echo off
REM GCP Cloud Run Deployment Script for Windows
REM Usage: deploy-gcp.bat <project-id> <database-url> <jwt-secret>

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Error: Project ID required
    echo Usage: deploy-gcp.bat ^<project-id^> ^<database-url^> ^<jwt-secret^>
    echo.
    echo Example:
    echo deploy-gcp.bat my-project-id "postgresql://user:pass@host/db?sslmode=require" "my-jwt-secret"
    exit /b 1
)

set PROJECT_ID=%1
set DATABASE_URL=%~2
set JWT_SECRET=%~3
set REGION=us-central1

if "%DATABASE_URL%"=="" (
    echo Error: Database URL required
    exit /b 1
)

if "%JWT_SECRET%"=="" set JWT_SECRET=super-secret-jwt-key-change-me

echo ========================================
echo   GCP Cloud Run Deployment
echo ========================================
echo.
echo Project ID: %PROJECT_ID%
echo Region: %REGION%
echo.

REM Set project
call gcloud config set project %PROJECT_ID%

REM Enable APIs
echo Enabling required APIs...
call gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com --quiet

REM Deploy Backend
echo.
echo ========================================
echo   Deploying Backend...
echo ========================================

cd backend
call gcloud run deploy apartment-backend ^
    --source . ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --memory 512Mi ^
    --set-env-vars "FLASK_ENV=production,JWT_SECRET_KEY=%JWT_SECRET%,DATABASE_URL=%DATABASE_URL%" ^
    --quiet

for /f "tokens=*" %%i in ('gcloud run services describe apartment-backend --region %REGION% --format="value(status.url)"') do set BACKEND_URL=%%i
echo Backend deployed: %BACKEND_URL%

cd ..

REM Deploy Frontend
echo.
echo ========================================
echo   Deploying Frontend...
echo ========================================

cd frontend\admin-app
call gcloud run deploy apartment-frontend ^
    --source . ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --memory 256Mi ^
    --build-arg "BACKEND_URL=%BACKEND_URL%" ^
    --quiet

for /f "tokens=*" %%i in ('gcloud run services describe apartment-frontend --region %REGION% --format="value(status.url)"') do set FRONTEND_URL=%%i
echo Frontend deployed: %FRONTEND_URL%

cd ..\..

REM Summary
echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Backend URL:  %BACKEND_URL%
echo Frontend URL: %FRONTEND_URL%
echo.
echo Your app is live at: %FRONTEND_URL%

endlocal
