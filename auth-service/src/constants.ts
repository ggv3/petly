// Rate Limiting
export const RATE_LIMIT = {
  REGISTER: {
    MAX: 10,
    TIME_WINDOW: '1 minute',
  },
  LOGIN: {
    MAX: 5,
    TIME_WINDOW: '1 minute',
  },
  REFRESH: {
    MAX: 20,
    TIME_WINDOW: '1 minute',
  },
  LOGOUT: {
    MAX: 10,
    TIME_WINDOW: '1 minute',
  },
};

// Password Hashing
export const PASSWORD = {
  SALT_ROUNDS: 10,
  MIN_LENGTH: 8,
  MAX_LENGTH: 100,
};

// Username Validation
export const USERNAME = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 50,
};

// Token Expiration
export const TOKEN = {
  REFRESH_EXPIRATION_DAYS: 7,
  RANDOM_BYTES_LENGTH: 32,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  USERNAME_EXISTS: 'Username already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
  USER_NOT_FOUND: 'User not found',
  INTERNAL_ERROR: 'Internal server error',
};
