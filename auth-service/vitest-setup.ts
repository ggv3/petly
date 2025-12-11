// Set up test environment variables before any imports
process.env.PORT = '3001';
process.env.HOST = '0.0.0.0';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.POSTGRES_DB = 'test_db';
process.env.POSTGRES_USER = 'test_user';
process.env.POSTGRES_PASSWORD = 'test_password';
process.env.JWT_ACCESS_SECRET = 'test_access_secret_key_min_32_chars_long';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_key_min_32_chars_long';
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
