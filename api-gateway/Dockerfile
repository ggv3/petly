FROM node:24-alpine

WORKDIR /app

# Copy root package files for workspace resolution
COPY package.json package-lock.json* ./

# Copy api-gateway workspace
COPY api-gateway ./api-gateway

# Install all dependencies (including workspaces)
RUN npm install

# Set working directory to api-gateway
WORKDIR /app/api-gateway

# Expose the service port
EXPOSE 3000

# Start the dev server with hot reloading
CMD ["npm", "run", "dev"]
