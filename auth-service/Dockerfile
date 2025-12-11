FROM node:24-alpine

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json* ./

# Copy database-schema workspace
COPY database-schema ./database-schema

# Copy auth-service workspace
COPY auth-service ./auth-service

# Install all dependencies (including workspaces)
RUN npm install

# Set working directory to auth-service
WORKDIR /app/auth-service

# Expose the service port
EXPOSE 3001

# Start the dev server with hot reloading
CMD ["npm", "run", "dev"]