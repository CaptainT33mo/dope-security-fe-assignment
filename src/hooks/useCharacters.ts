import { useEffect, useState } from "react";
import { API_CONFIG, buildApiUrl } from "../config/api";
import type { Character } from "../data/characters";

export function useCharacters() {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchCharacters = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(
					buildApiUrl(API_CONFIG.ENDPOINTS.CHARACTERS),
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch characters: ${response.statusText}`);
				}

				const data = await response.json();
				setCharacters(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				console.error("Error fetching characters:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchCharacters();
	}, []);

	return { characters, loading, error };
}
