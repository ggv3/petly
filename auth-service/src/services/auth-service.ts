import crypto from 'node:crypto';
import { refreshToken, user } from '@petly/database-schema';
import { eq } from 'drizzle-orm';
import { db } from '../config/database.js';
import { ERROR_MESSAGES, TOKEN } from '../constants.js';
import type { AuthToken, LoginInput, RegisterInput } from '../types.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export const register = async (input: RegisterInput): Promise<AuthToken> => {
  // Check if user already exists
  const existingUser = await db.query.user.findFirst({
    where: eq(user.username, input.username),
  });

  if (existingUser) {
    throw new Error(ERROR_MESSAGES.USERNAME_EXISTS);
  }

  // Hash password and create user
  const passwordHash = await hashPassword(input.password);
  const [newUser] = await db
    .insert(user)
    .values({
      username: input.username,
      passwordHash,
    })
    .returning();

  // Generate tokens
  return generateTokensForUser(newUser.id, newUser.username);
};

export const login = async (input: LoginInput): Promise<AuthToken> => {
  // Find user
  const foundUser = await db.query.user.findFirst({
    where: eq(user.username, input.username),
  });

  if (!foundUser) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Verify password
  const isValid = await verifyPassword(input.password, foundUser.passwordHash);
  if (!isValid) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  // Generate tokens
  return generateTokensForUser(foundUser.id, foundUser.username);
};

export const refresh = async (token: string): Promise<AuthToken> => {
  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Check if token exists in database and is not revoked
  const storedToken = await db.query.refreshToken.findFirst({
    where: eq(refreshToken.id, payload.tokenId),
  });

  if (!storedToken || storedToken.revokedAt !== null) {
    throw new Error(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
  }

  // Check if token is expired
  if (new Date() > storedToken.expiresAt) {
    throw new Error(ERROR_MESSAGES.REFRESH_TOKEN_EXPIRED);
  }

  // Get user
  const foundUser = await db.query.user.findFirst({
    where: eq(user.id, payload.userId),
  });

  if (!foundUser) {
    throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  // Generate new tokens
  return generateTokensForUser(foundUser.id, foundUser.username);
};

export const logout = async (token: string): Promise<void> => {
  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Revoke the token
  await db
    .update(refreshToken)
    .set({ revokedAt: new Date() })
    .where(eq(refreshToken.id, payload.tokenId));
};

const generateTokensForUser = async (userId: string, username: string): Promise<AuthToken> => {
  // Generate access token
  const accessToken = generateAccessToken({ userId, username });

  // Create refresh token in database
  const tokenHash = crypto.randomBytes(TOKEN.RANDOM_BYTES_LENGTH).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + TOKEN.REFRESH_EXPIRATION_DAYS);

  const [newRefreshToken] = await db
    .insert(refreshToken)
    .values({
      userId,
      tokenHash,
      expiresAt,
    })
    .returning();

  // Generate refresh token JWT
  const refreshTokenJwt = generateRefreshToken({
    userId,
    tokenId: newRefreshToken.id,
  });

  return {
    accessToken,
    refreshToken: refreshTokenJwt,
  };
};
