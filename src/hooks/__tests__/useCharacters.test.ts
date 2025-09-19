import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCharacters } from "../useCharacters";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useCharacters", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should fetch characters successfully", async () => {
		const mockCharacters = [
			{
				id: "char_1",
				name: "Naruto Uzumaki",
				location: "Konoha",
				health: "Healthy",
				power: 10000,
				viewed: false,
			},
			{
				id: "char_2",
				name: "Sasuke Uchiha",
				location: "Konoha",
				health: "Injured",
				power: 9500,
				viewed: false,
			},
		];

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockCharacters,
		});

		const { result } = renderHook(() => useCharacters());

		expect(result.current.loading).toBe(true);
		expect(result.current.characters).toEqual([]);
		expect(result.current.error).toBe(null);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.characters).toEqual(mockCharacters);
		expect(result.current.error).toBe(null);
		expect(mockFetch).toHaveBeenCalledWith("http://localhost:3002/characters");
	});

	it("should handle fetch error", async () => {
		const errorMessage = "Failed to fetch";
		mockFetch.mockRejectedValueOnce(new Error(errorMessage));

		const { result } = renderHook(() => useCharacters());

		expect(result.current.loading).toBe(true);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.characters).toEqual([]);
		expect(result.current.error).toBe(errorMessage);
	});

	it("should handle non-ok response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			statusText: "Not Found",
		});

		const { result } = renderHook(() => useCharacters());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.characters).toEqual([]);
		expect(result.current.error).toBe("Failed to fetch characters: Not Found");
	});

	it("should handle network error", async () => {
		mockFetch.mockRejectedValueOnce(new Error("Network error"));

		const { result } = renderHook(() => useCharacters());

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		expect(result.current.characters).toEqual([]);
		expect(result.current.error).toBe("Network error");
	});
});
