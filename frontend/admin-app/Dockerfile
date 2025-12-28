# Stage 1: Build Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Accept backend URL as build argument OR environment variable
ARG BACKEND_URL
ENV BACKEND_URL=${BACKEND_URL:-https://apartment-backend-xxxxx.run.app}

# Copy package files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Debug: Show BACKEND_URL value
RUN echo "BACKEND_URL is: ${BACKEND_URL}"

# Replace environment.prod.ts with actual backend URL
RUN echo "// Production environment - Auto-generated" > src/environments/environment.prod.ts && \
    echo "export const environment = {" >> src/environments/environment.prod.ts && \
    echo "  production: true," >> src/environments/environment.prod.ts && \
    echo "  apiUrl: '${BACKEND_URL}/api'" >> src/environments/environment.prod.ts && \
    echo "};" >> src/environments/environment.prod.ts

# Debug: Show the generated file
RUN echo "=== Generated environment.prod.ts ===" && cat src/environments/environment.prod.ts

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
