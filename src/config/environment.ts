/**
 * Environment configuration
 * Handles environment variables with fallbacks
 */

export const ENV_CONFIG = {
	API_BASE_URL: import.meta.env.VITE_API_BASE_URL || getDefaultApiUrl(),

	DEV_MODE: import.meta.env.VITE_DEV_MODE === "true" || import.meta.env.DEV,
	ENABLE_DEVTOOLS:
		import.meta.env.VITE_ENABLE_DEVTOOLS === "true" || import.meta.env.DEV,

	IS_PRODUCTION: import.meta.env.PROD,
	IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

/**
 * Get the default API URL based on environment
 */
function getDefaultApiUrl(): string {
	if (import.meta.env.PROD) {
		return "/.netlify/functions/api";
	}

	// In development, use localhost JSON server
	return "http://localhost:3002";
}

/**
 * Validate environment configuration
 */
export function validateEnvironment(): void {
	const requiredVars = ["API_BASE_URL"] as const;

	for (const varName of requiredVars) {
		const value = ENV_CONFIG[varName];
		if (!value) {
			console.warn(
				`Environment variable ${varName} is not set, using default value`,
			);
		}
	}

	if (ENV_CONFIG.DEV_MODE) {
		console.log("Environment Configuration:", {
			API_BASE_URL: ENV_CONFIG.API_BASE_URL,
			DEV_MODE: ENV_CONFIG.DEV_MODE,
			ENABLE_DEVTOOLS: ENV_CONFIG.ENABLE_DEVTOOLS,
			IS_PRODUCTION: ENV_CONFIG.IS_PRODUCTION,
		});
	}
}
