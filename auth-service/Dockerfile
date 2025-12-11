FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the service port
EXPOSE 3001

# Start the dev server with hot reloading
CMD ["npm", "run", "dev"]