# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Set build argument for API URL (can be overridden during build)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional, using default for now)
# EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
