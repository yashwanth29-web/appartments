#!/bin/bash

# GCP Cloud Run Deployment Script
# Usage: ./deploy-gcp.sh <project-id> <database-url> <jwt-secret>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ -z "$1" ]; then
    echo -e "${RED}Error: Project ID required${NC}"
    echo "Usage: ./deploy-gcp.sh <project-id> <database-url> <jwt-secret>"
    echo ""
    echo "Example:"
    echo "./deploy-gcp.sh my-project-id 'postgresql://user:pass@host/db?sslmode=require' 'my-jwt-secret'"
    exit 1
fi

if [ -z "$2" ]; then
    echo -e "${RED}Error: Database URL required${NC}"
    exit 1
fi

PROJECT_ID=$1
DATABASE_URL=$2
JWT_SECRET=${3:-"super-secret-jwt-key-change-me"}
REGION="us-central1"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GCP Cloud Run Deployment${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Project ID: ${YELLOW}$PROJECT_ID${NC}"
echo -e "Region: ${YELLOW}$REGION${NC}"
echo ""

# Set project
gcloud config set project $PROJECT_ID

# Enable APIs
echo -e "${YELLOW}Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com --quiet

# Deploy Backend
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploying Backend...${NC}"
echo -e "${GREEN}========================================${NC}"

cd backend
gcloud run deploy apartment-backend \
    --source . \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --set-env-vars "FLASK_ENV=production,JWT_SECRET_KEY=$JWT_SECRET,DATABASE_URL=$DATABASE_URL" \
    --quiet

BACKEND_URL=$(gcloud run services describe apartment-backend --region $REGION --format='value(status.url)')
echo -e "${GREEN}Backend deployed: $BACKEND_URL${NC}"

cd ..

# Deploy Frontend
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deploying Frontend...${NC}"
echo -e "${GREEN}========================================${NC}"

cd frontend/admin-app
gcloud run deploy apartment-frontend \
    --source . \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 256Mi \
    --build-arg "BACKEND_URL=$BACKEND_URL" \
    --quiet

FRONTEND_URL=$(gcloud run services describe apartment-frontend --region $REGION --format='value(status.url)')
echo -e "${GREEN}Frontend deployed: $FRONTEND_URL${NC}"

cd ../..

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Backend URL:  ${YELLOW}$BACKEND_URL${NC}"
echo -e "Frontend URL: ${YELLOW}$FRONTEND_URL${NC}"
echo ""
echo -e "${GREEN}Your app is live at: $FRONTEND_URL${NC}"
