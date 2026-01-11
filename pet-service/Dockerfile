FROM node:24-alpine

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json* ./

# Copy database-schema workspace
COPY database-schema ./database-schema

# Copy pet-service workspace
COPY pet-service ./pet-service

# Install all dependencies (including workspaces)
RUN npm install

# Set working directory to pet-service
WORKDIR /app/pet-service

# Expose the service port
EXPOSE 3003

# Start the dev server with hot reloading
CMD ["npm", "run", "dev"]
