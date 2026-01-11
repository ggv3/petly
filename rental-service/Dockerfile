FROM node:24-alpine

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json* ./

# Copy database-schema workspace
COPY database-schema ./database-schema

# Copy rental-service workspace
COPY rental-service ./rental-service

# Install all dependencies (including workspaces)
RUN npm install

# Set working directory to rental-service
WORKDIR /app/rental-service

# Expose the service port
EXPOSE 3004

# Start the dev server with hot reloading
CMD ["npm", "run", "dev"]
