# Step 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite application to the /dist folder
RUN npm run build

# Step 2: Serve the application using Node/Vite preview
FROM node:20-alpine

WORKDIR /app

# Copy the built assets and package config from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port 9010
EXPOSE 9010

# Start Vite preview server on port 9010
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "9010"]
