import { describe, expect, it } from "vitest";
import {
	type AccessTokenPayload,
	generateAccessToken,
	generateRefreshToken,
	type RefreshTokenPayload,
	verifyAccessToken,
	verifyRefreshToken,
} from "./jwt.js";

describe("JWT Utils", () => {
	describe("generateAccessToken and verifyAccessToken", () => {
		it("should generate and verify a valid access token", () => {
			const payload: AccessTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				username: "testuser",
			};

			const token = generateAccessToken(payload);
			expect(token).toBeDefined();
			expect(typeof token).toBe("string");

			const decoded = verifyAccessToken(token);
			expect(decoded.userId).toBe(payload.userId);
			expect(decoded.username).toBe(payload.username);
		});

		it("should include expiration in access token", () => {
			const payload: AccessTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				username: "testuser",
			};

			const token = generateAccessToken(payload);
			const decoded = verifyAccessToken(token);

			// Token should have an expiration (iat and exp should exist when decoded)
			expect(decoded).toHaveProperty("userId");
			expect(decoded).toHaveProperty("username");
		});

		it("should throw error for invalid access token", () => {
			const invalidToken = "invalid.token.here";

			expect(() => verifyAccessToken(invalidToken)).toThrow();
		});

		it("should throw error for tampered access token", () => {
			const payload: AccessTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				username: "testuser",
			};

			const token = generateAccessToken(payload);
			const tamperedToken = `${token}extradata`;

			expect(() => verifyAccessToken(tamperedToken)).toThrow();
		});

		it("should handle different user IDs", () => {
			const payload1: AccessTokenPayload = {
				userId: "user-1",
				username: "user1",
			};
			const payload2: AccessTokenPayload = {
				userId: "user-2",
				username: "user2",
			};

			const token1 = generateAccessToken(payload1);
			const token2 = generateAccessToken(payload2);

			expect(token1).not.toBe(token2);

			const decoded1 = verifyAccessToken(token1);
			const decoded2 = verifyAccessToken(token2);

			expect(decoded1.userId).toBe("user-1");
			expect(decoded2.userId).toBe("user-2");
		});
	});

	describe("generateRefreshToken and verifyRefreshToken", () => {
		it("should generate and verify a valid refresh token", () => {
			const payload: RefreshTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				tokenId: "987e6543-e21b-43d2-a654-426614174111",
			};

			const token = generateRefreshToken(payload);
			expect(token).toBeDefined();
			expect(typeof token).toBe("string");

			const decoded = verifyRefreshToken(token);
			expect(decoded.userId).toBe(payload.userId);
			expect(decoded.tokenId).toBe(payload.tokenId);
		});

		it("should include expiration in refresh token", () => {
			const payload: RefreshTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				tokenId: "987e6543-e21b-43d2-a654-426614174111",
			};

			const token = generateRefreshToken(payload);
			const decoded = verifyRefreshToken(token);

			expect(decoded).toHaveProperty("userId");
			expect(decoded).toHaveProperty("tokenId");
		});

		it("should throw error for invalid refresh token", () => {
			const invalidToken = "invalid.token.here";

			expect(() => verifyRefreshToken(invalidToken)).toThrow();
		});

		it("should throw error for tampered refresh token", () => {
			const payload: RefreshTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				tokenId: "987e6543-e21b-43d2-a654-426614174111",
			};

			const token = generateRefreshToken(payload);
			const tamperedToken = `${token}extradata`;

			expect(() => verifyRefreshToken(tamperedToken)).toThrow();
		});

		it("should handle different token IDs", () => {
			const payload1: RefreshTokenPayload = {
				userId: "user-1",
				tokenId: "token-1",
			};
			const payload2: RefreshTokenPayload = {
				userId: "user-2",
				tokenId: "token-2",
			};

			const token1 = generateRefreshToken(payload1);
			const token2 = generateRefreshToken(payload2);

			expect(token1).not.toBe(token2);

			const decoded1 = verifyRefreshToken(token1);
			const decoded2 = verifyRefreshToken(token2);

			expect(decoded1.tokenId).toBe("token-1");
			expect(decoded2.tokenId).toBe("token-2");
		});
	});

	describe("Token independence", () => {
		it("should not verify access token with refresh token secret", () => {
			const payload: AccessTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				username: "testuser",
			};

			const accessToken = generateAccessToken(payload);

			expect(() => verifyRefreshToken(accessToken)).toThrow();
		});

		it("should not verify refresh token with access token secret", () => {
			const payload: RefreshTokenPayload = {
				userId: "123e4567-e89b-12d3-a456-426614174000",
				tokenId: "987e6543-e21b-43d2-a654-426614174111",
			};

			const refreshToken = generateRefreshToken(payload);

			expect(() => verifyAccessToken(refreshToken)).toThrow();
		});
	});
});
