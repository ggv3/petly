import { beforeEach, describe, expect, it, vi } from "vitest";
import * as database from "../config/database.js";
import * as authService from "./auth-service.js";

// Mock the database module
vi.mock("../config/database.js", () => ({
  db: {
    query: {
      user: {
        findFirst: vi.fn(),
      },
      refreshToken: {
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(),
      })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(),
      })),
    })),
  },
}));

describe("Auth Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        username: "testuser",
        passwordHash: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockRefreshToken = {
        id: "987e6543-e21b-43d2-a654-426614174111",
        userId: mockUser.id,
        tokenHash: "randomhash",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      };

      // Mock user doesn't exist
      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        undefined,
      );

      // Mock user creation
      const insertMock = vi.fn().mockResolvedValueOnce([mockUser]);
      const valuesMock = vi.fn().mockReturnValueOnce({ returning: insertMock });
      vi.mocked(database.db.insert).mockReturnValueOnce({
        values: valuesMock,
      } as never);

      // Mock refresh token creation
      const insertTokenMock = vi.fn().mockResolvedValueOnce([mockRefreshToken]);
      const valuesTokenMock = vi
        .fn()
        .mockReturnValueOnce({ returning: insertTokenMock });
      vi.mocked(database.db.insert).mockReturnValueOnce({
        values: valuesTokenMock,
      } as never);

      const result = await authService.register({
        username: "testuser",
        password: "password123",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("should throw error when username already exists", async () => {
      const existingUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        username: "existinguser",
        passwordHash: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        existingUser,
      );

      await expect(
        authService.register({
          username: "existinguser",
          password: "password123",
        }),
      ).rejects.toThrow("Username already exists");
    });

    it("should hash the password before storing", async () => {
      const mockUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        username: "testuser",
        passwordHash: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockRefreshToken = {
        id: "987e6543-e21b-43d2-a654-426614174111",
        userId: mockUser.id,
        tokenHash: "randomhash",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      };

      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        undefined,
      );

      const insertMock = vi.fn().mockResolvedValueOnce([mockUser]);
      const valuesMock = vi.fn().mockReturnValueOnce({ returning: insertMock });
      vi.mocked(database.db.insert).mockReturnValueOnce({
        values: valuesMock,
      } as never);

      const insertTokenMock = vi.fn().mockResolvedValueOnce([mockRefreshToken]);
      const valuesTokenMock = vi
        .fn()
        .mockReturnValueOnce({ returning: insertTokenMock });
      vi.mocked(database.db.insert).mockReturnValueOnce({
        values: valuesTokenMock,
      } as never);

      await authService.register({
        username: "testuser",
        password: "plainpassword",
      });

      // Check that values was called with a hashed password (not plain text)
      expect(valuesMock).toHaveBeenCalledWith(
        expect.objectContaining({
          username: "testuser",
          passwordHash: expect.any(String),
        }),
      );
    });
  });

  describe("login", () => {
    it("should login successfully with correct credentials", async () => {
      const { hashPassword } = await import("../utils/password.js");
      const passwordHash = await hashPassword("password123");

      const mockUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        username: "testuser",
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockRefreshToken = {
        id: "987e6543-e21b-43d2-a654-426614174111",
        userId: mockUser.id,
        tokenHash: "randomhash",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      };

      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        mockUser,
      );

      const insertTokenMock = vi.fn().mockResolvedValueOnce([mockRefreshToken]);
      const valuesTokenMock = vi
        .fn()
        .mockReturnValueOnce({ returning: insertTokenMock });
      vi.mocked(database.db.insert).mockReturnValueOnce({
        values: valuesTokenMock,
      } as never);

      const result = await authService.login({
        username: "testuser",
        password: "password123",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("should throw error when user does not exist", async () => {
      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        undefined,
      );

      await expect(
        authService.login({
          username: "nonexistent",
          password: "password123",
        }),
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error when password is incorrect", async () => {
      const { hashPassword } = await import("../utils/password.js");
      const passwordHash = await hashPassword("password123");

      const mockUser = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        username: "testuser",
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        mockUser,
      );

      await expect(
        authService.login({
          username: "testuser",
          password: "wrongpassword",
        }),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("refresh", () => {
    it("should refresh tokens successfully with valid refresh token", async () => {
      const mockTokenId = "987e6543-e21b-43d2-a654-426614174111";
      const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

      const mockStoredToken = {
        id: mockTokenId,
        userId: mockUserId,
        tokenHash: "randomhash",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      };

      const mockUser = {
        id: mockUserId,
        username: "testuser",
        passwordHash: "hashedpassword",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockNewRefreshToken = {
        id: "new-token-id",
        userId: mockUserId,
        tokenHash: "newrandomhash",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      };

      // Create a valid refresh token
      const { generateRefreshToken } = await import("../utils/jwt.js");
      const validRefreshToken = generateRefreshToken({
        userId: mockUserId,
        tokenId: mockTokenId,
      });

      vi.mocked(database.db.query.refreshToken.findFirst).mockResolvedValueOnce(
        mockStoredToken,
      );
      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        mockUser,
      );

      const insertTokenMock = vi
        .fn()
        .mockResolvedValueOnce([mockNewRefreshToken]);
      const valuesTokenMock = vi
        .fn()
        .mockReturnValueOnce({ returning: insertTokenMock });
      vi.mocked(database.db.insert).mockReturnValueOnce({
        values: valuesTokenMock,
      } as never);

      const result = await authService.refresh(validRefreshToken);

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("should throw error when refresh token is invalid", async () => {
      const invalidToken = "invalid.token.here";

      await expect(authService.refresh(invalidToken)).rejects.toThrow();
    });

    it("should throw error when refresh token is revoked", async () => {
      const mockTokenId = "987e6543-e21b-43d2-a654-426614174111";
      const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

      const mockStoredToken = {
        id: mockTokenId,
        userId: mockUserId,
        tokenHash: "randomhash",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: new Date(), // Token is revoked
      };

      const { generateRefreshToken } = await import("../utils/jwt.js");
      const validRefreshToken = generateRefreshToken({
        userId: mockUserId,
        tokenId: mockTokenId,
      });

      vi.mocked(database.db.query.refreshToken.findFirst).mockResolvedValueOnce(
        mockStoredToken,
      );

      await expect(authService.refresh(validRefreshToken)).rejects.toThrow(
        "Invalid refresh token",
      );
    });

    it("should throw error when refresh token is expired", async () => {
      const mockTokenId = "987e6543-e21b-43d2-a654-426614174111";
      const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

      const mockStoredToken = {
        id: mockTokenId,
        userId: mockUserId,
        tokenHash: "randomhash",
        expiresAt: new Date(Date.now() - 1000), // Expired
        createdAt: new Date(),
        revokedAt: null,
      };

      const { generateRefreshToken } = await import("../utils/jwt.js");
      const validRefreshToken = generateRefreshToken({
        userId: mockUserId,
        tokenId: mockTokenId,
      });

      vi.mocked(database.db.query.refreshToken.findFirst).mockResolvedValueOnce(
        mockStoredToken,
      );

      await expect(authService.refresh(validRefreshToken)).rejects.toThrow(
        "Refresh token expired",
      );
    });

    it("should throw error when user not found", async () => {
      const mockTokenId = "987e6543-e21b-43d2-a654-426614174111";
      const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

      const mockStoredToken = {
        id: mockTokenId,
        userId: mockUserId,
        tokenHash: "randomhash",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        revokedAt: null,
      };

      const { generateRefreshToken } = await import("../utils/jwt.js");
      const validRefreshToken = generateRefreshToken({
        userId: mockUserId,
        tokenId: mockTokenId,
      });

      vi.mocked(database.db.query.refreshToken.findFirst).mockResolvedValueOnce(
        mockStoredToken,
      );
      vi.mocked(database.db.query.user.findFirst).mockResolvedValueOnce(
        undefined,
      );

      await expect(authService.refresh(validRefreshToken)).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("logout", () => {
    it("should revoke refresh token successfully", async () => {
      const mockTokenId = "987e6543-e21b-43d2-a654-426614174111";
      const mockUserId = "123e4567-e89b-12d3-a456-426614174000";

      const { generateRefreshToken } = await import("../utils/jwt.js");
      const validRefreshToken = generateRefreshToken({
        userId: mockUserId,
        tokenId: mockTokenId,
      });

      const whereMock = vi.fn().mockResolvedValueOnce(undefined);
      const setMock = vi.fn().mockReturnValueOnce({ where: whereMock });
      vi.mocked(database.db.update).mockReturnValueOnce({
        set: setMock,
      } as never);

      await authService.logout(validRefreshToken);

      expect(database.db.update).toHaveBeenCalled();
      expect(setMock).toHaveBeenCalledWith(
        expect.objectContaining({
          revokedAt: expect.any(Date),
        }),
      );
    });

    it("should throw error when refresh token is invalid", async () => {
      const invalidToken = "invalid.token.here";

      await expect(authService.logout(invalidToken)).rejects.toThrow();
    });
  });
});
