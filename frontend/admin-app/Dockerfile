# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Accept backend URL as build argument
ARG BACKEND_URL=https://apartment-backend-xxxxx.run.app

# Copy package files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Replace placeholder in environment.prod.ts with actual backend URL
RUN sed -i "s|BACKEND_API_URL|${BACKEND_URL}/api|g" src/environments/environment.prod.ts

# Build with production configuration
RUN npm run build -- --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY --from=build /app/dist/admin-app/browser/ /usr/share/nginx/html

# Cloud Run uses PORT env variable (default 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
