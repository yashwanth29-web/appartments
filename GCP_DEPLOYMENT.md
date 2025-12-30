# GCP Cloud Run Deployment Guide

## Prerequisites

1. Google Cloud account with billing enabled
2. `gcloud` CLI installed and authenticated
3. Your Neon PostgreSQL database URL ready

## Step-by-Step Deployment (Mumbai Region - asia-south1)

### Step 1: Set up GCP Project

```bash
# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Deploy Backend FIRST

```bash
cd backend

# Build and deploy backend to Mumbai region
gcloud run deploy apartment-backend ^
  --source . ^
  --region asia-south1 ^
  --platform managed ^
  --allow-unauthenticated ^
  --memory 512Mi ^
  --set-env-vars "FLASK_ENV=production" ^
  --set-env-vars "JWT_SECRET_KEY=your-super-secret-jwt-key-change-this" ^
  --set-env-vars "DATABASE_URL=postgresql://neondb_owner:npg_g0N7mRDuZfKB@ep-long-tree-adsh5yl5-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Get the backend URL (save this!)
gcloud run services describe apartment-backend --region asia-south1 --format="value(status.url)"
```

**Copy the backend URL** - you'll need it for the frontend deployment.
Example: `https://apartment-backend-nzuzyvi5nq-el.a.run.app`

### Step 3: Deploy Frontend with Backend URL

```bash
cd ..\frontend\admin-app

# Build and deploy frontend with backend URL
gcloud run deploy apartment-frontend ^
  --source . ^
  --region asia-south1 ^
  --platform managed ^
  --allow-unauthenticated ^
  --memory 256Mi ^
  --set-build-env-vars "BACKEND_URL=https://apartment-backend-nzuzyvi5nq-el.a.run.app"

# Get the frontend URL
gcloud run services describe apartment-frontend --region asia-south1 --format="value(status.url)"
```

### Step 4: Test Your Deployment

1. Open the frontend URL in your browser
2. Try logging in with:
   - Admin: `admin@example.com` / `admin123`
   - User: `user@example.com` / `user123`
3. Check browser console for any errors

## Environment Variables

### Backend
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL URL | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET_KEY` | Secret for JWT tokens | `your-super-secret-key` |
| `FLASK_ENV` | Environment mode | `production` |

### Frontend
| Variable | Description | Example |
|----------|-------------|---------|
| `BACKEND_URL` | Backend Cloud Run URL (build env) | `https://apartment-backend-xxx.run.app` |

## Troubleshooting

### Check Backend Logs
```bash
gcloud run services logs read apartment-backend --region asia-south1 --limit 50
```

### Check Frontend Logs
```bash
gcloud run services logs read apartment-frontend --region asia-south1 --limit 50
```

### Test Backend Health
```bash
curl https://your-backend-url.run.app/health
```

### Common Issues

1. **CORS errors**: Backend is configured to allow all origins
2. **502 Bad Gateway**: Check backend logs for startup errors
3. **Database connection failed**: Verify DATABASE_URL is correct
4. **Login not working**: Check JWT_SECRET_KEY is set
5. **Frontend still connecting to localhost**: Verify `--set-build-env-vars` was used and check build logs

## Update Deployment

To update after code changes:

```bash
# Update backend
cd backend
gcloud run deploy apartment-backend --source . --region asia-south1

# Update frontend (with backend URL)
cd ..\frontend\admin-app
gcloud run deploy apartment-frontend --source . --region asia-south1 ^
  --set-build-env-vars "BACKEND_URL=https://apartment-backend-nzuzyvi5nq-el.a.run.app"
```

## Cost Optimization

- Cloud Run scales to zero when not in use (free!)
- Free tier: 2 million requests/month
- Set `--max-instances 10` to limit costs
