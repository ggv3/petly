import type { FastifyInstance } from "fastify";
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { buildServer } from "../server.js";
import * as authService from "../services/auth-service.js";

// Mock the auth service module
vi.mock("../services/auth-service.js", () => ({
	register: vi.fn(),
	login: vi.fn(),
	refresh: vi.fn(),
	logout: vi.fn(),
}));

describe("Auth Routes", () => {
	let server: FastifyInstance;

	beforeAll(async () => {
		server = buildServer({ logger: false });
		await server.ready();
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterAll(async () => {
		await server.close();
	});

	describe("POST /auth/register", () => {
		it("should register a new user successfully", async () => {
			const mockTokens = {
				accessToken: "mock.access.token",
				refreshToken: "mock.refresh.token",
			};

			vi.mocked(authService.register).mockResolvedValueOnce(mockTokens);

			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "testuser",
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(201);
			expect(response.json()).toEqual(mockTokens);
			expect(authService.register).toHaveBeenCalledWith({
				username: "testuser",
				password: "password123",
			});
		});

		it("should return 400 when username is too short", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "ab",
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 400 when username is too long", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "a".repeat(51),
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 400 when password is too short", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "testuser",
					password: "short",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 400 when password is too long", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "testuser",
					password: "a".repeat(101),
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 400 when username is missing", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 400 when password is missing", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "testuser",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 400 when username already exists", async () => {
			vi.mocked(authService.register).mockRejectedValueOnce(
				new Error("Username already exists"),
			);

			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "existinguser",
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toEqual({
				error: "Username already exists",
			});
		});

		it("should return 500 when an unexpected error occurs", async () => {
			vi.mocked(authService.register).mockRejectedValueOnce("Unexpected error");

			const response = await server.inject({
				method: "POST",
				url: "/auth/register",
				payload: {
					username: "testuser",
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(500);
			expect(response.json()).toEqual({
				error: "Internal server error",
			});
		});
	});

	describe("POST /auth/login", () => {
		it("should login successfully with correct credentials", async () => {
			const mockTokens = {
				accessToken: "mock.access.token",
				refreshToken: "mock.refresh.token",
			};

			vi.mocked(authService.login).mockResolvedValueOnce(mockTokens);

			const response = await server.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					username: "testuser",
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toEqual(mockTokens);
			expect(authService.login).toHaveBeenCalledWith({
				username: "testuser",
				password: "password123",
			});
		});

		it("should return 401 when credentials are invalid", async () => {
			vi.mocked(authService.login).mockRejectedValueOnce(
				new Error("Invalid credentials"),
			);

			const response = await server.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					username: "testuser",
					password: "wrongpassword",
				},
			});

			expect(response.statusCode).toBe(401);
			expect(response.json()).toEqual({
				error: "Invalid credentials",
			});
		});

		it("should return 400 when username is missing", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(401);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 400 when password is missing", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					username: "testuser",
				},
			});

			expect(response.statusCode).toBe(401);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 500 when an unexpected error occurs", async () => {
			vi.mocked(authService.login).mockRejectedValueOnce("Unexpected error");

			const response = await server.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					username: "testuser",
					password: "password123",
				},
			});

			expect(response.statusCode).toBe(500);
			expect(response.json()).toEqual({
				error: "Internal server error",
			});
		});
	});

	describe("POST /auth/refresh", () => {
		it("should refresh tokens successfully with valid refresh token", async () => {
			const mockTokens = {
				accessToken: "new.access.token",
				refreshToken: "new.refresh.token",
			};

			vi.mocked(authService.refresh).mockResolvedValueOnce(mockTokens);

			const response = await server.inject({
				method: "POST",
				url: "/auth/refresh",
				payload: {
					refreshToken: "valid.refresh.token",
				},
			});

			expect(response.statusCode).toBe(200);
			expect(response.json()).toEqual(mockTokens);
			expect(authService.refresh).toHaveBeenCalledWith("valid.refresh.token");
		});

		it("should return 401 when refresh token is invalid", async () => {
			vi.mocked(authService.refresh).mockRejectedValueOnce(
				new Error("Invalid refresh token"),
			);

			const response = await server.inject({
				method: "POST",
				url: "/auth/refresh",
				payload: {
					refreshToken: "invalid.token",
				},
			});

			expect(response.statusCode).toBe(401);
			expect(response.json()).toEqual({
				error: "Invalid refresh token",
			});
		});

		it("should return 401 when refresh token is expired", async () => {
			vi.mocked(authService.refresh).mockRejectedValueOnce(
				new Error("Refresh token expired"),
			);

			const response = await server.inject({
				method: "POST",
				url: "/auth/refresh",
				payload: {
					refreshToken: "expired.token",
				},
			});

			expect(response.statusCode).toBe(401);
			expect(response.json()).toEqual({
				error: "Refresh token expired",
			});
		});

		it("should return 401 when refresh token is missing", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/refresh",
				payload: {},
			});

			expect(response.statusCode).toBe(401);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 500 when an unexpected error occurs", async () => {
			vi.mocked(authService.refresh).mockRejectedValueOnce("Unexpected error");

			const response = await server.inject({
				method: "POST",
				url: "/auth/refresh",
				payload: {
					refreshToken: "valid.refresh.token",
				},
			});

			expect(response.statusCode).toBe(500);
			expect(response.json()).toEqual({
				error: "Internal server error",
			});
		});
	});

	describe("POST /auth/logout", () => {
		it("should logout successfully", async () => {
			vi.mocked(authService.logout).mockResolvedValueOnce();

			const response = await server.inject({
				method: "POST",
				url: "/auth/logout",
				payload: {
					refreshToken: "valid.refresh.token",
				},
			});

			expect(response.statusCode).toBe(204);
			expect(response.body).toBe("");
			expect(authService.logout).toHaveBeenCalledWith("valid.refresh.token");
		});

		it("should return 400 when refresh token is invalid", async () => {
			vi.mocked(authService.logout).mockRejectedValueOnce(
				new Error("Invalid token"),
			);

			const response = await server.inject({
				method: "POST",
				url: "/auth/logout",
				payload: {
					refreshToken: "invalid.token",
				},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toEqual({
				error: "Invalid token",
			});
		});

		it("should return 400 when refresh token is missing", async () => {
			const response = await server.inject({
				method: "POST",
				url: "/auth/logout",
				payload: {},
			});

			expect(response.statusCode).toBe(400);
			expect(response.json()).toHaveProperty("error");
		});

		it("should return 500 when an unexpected error occurs", async () => {
			vi.mocked(authService.logout).mockRejectedValueOnce("Unexpected error");

			const response = await server.inject({
				method: "POST",
				url: "/auth/logout",
				payload: {
					refreshToken: "valid.refresh.token",
				},
			});

			expect(response.statusCode).toBe(500);
			expect(response.json()).toEqual({
				error: "Internal server error",
			});
		});
	});
});

describe("Auth Routes - Rate Limiting", () => {
	let server: FastifyInstance;

	beforeAll(async () => {
		server = buildServer({ logger: false });
		await server.ready();
	});

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterAll(async () => {
		await server.close();
	});

	it("should enforce rate limiting on /auth/login after 5 requests", async () => {
		const mockTokens = {
			accessToken: "mock.access.token",
			refreshToken: "mock.refresh.token",
		};

		vi.mocked(authService.login).mockResolvedValue(mockTokens);

		// Make 5 successful requests
		for (let i = 0; i < 5; i++) {
			const response = await server.inject({
				method: "POST",
				url: "/auth/login",
				payload: {
					username: "testuser",
					password: "password123",
				},
			});
			expect(response.statusCode).toBe(200);
		}

		// 6th request should be rate limited
		const rateLimitedResponse = await server.inject({
			method: "POST",
			url: "/auth/login",
			payload: {
				username: "testuser",
				password: "password123",
			},
		});

		expect(rateLimitedResponse.statusCode).toBe(429);
	});
});
