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

# Change Nginx listen port to 8070
RUN sed -i 's/80/8070/g' /etc/nginx/conf.d/default.conf

# Copy build artifacts to nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 8070

CMD ["nginx", "-g", "daemon off;"]
