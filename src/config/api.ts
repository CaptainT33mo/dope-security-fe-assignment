/**
 * API configuration for different environments
 */

import { ENV_CONFIG } from "./environment";

export const API_CONFIG = {
	BASE_URL: ENV_CONFIG.API_BASE_URL,
	ENDPOINTS: {
		CHARACTERS: "/characters",
	},
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
	return `${API_CONFIG.BASE_URL}${endpoint}`;
};
