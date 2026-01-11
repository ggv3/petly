FROM node:24-alpine

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json* ./

# Copy database-schema workspace
COPY database-schema ./database-schema

# Copy user-service workspace
COPY user-service ./user-service

# Install all dependencies (including workspaces)
RUN npm install

# Set working directory to user-service
WORKDIR /app/user-service

# Expose the service port
EXPOSE 3002

# Start the dev server with hot reloading
CMD ["npm", "run", "dev"]
