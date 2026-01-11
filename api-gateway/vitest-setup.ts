// Set up test environment variables before any imports
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.HOST = '0.0.0.0';
process.env.AUTH_SERVICE_URL = 'http://localhost:3001';
process.env.USER_SERVICE_URL = 'http://localhost:3002';
process.env.PET_SERVICE_URL = 'http://localhost:3003';
process.env.RENTAL_SERVICE_URL = 'http://localhost:3004';
