package utils

import (
	"log"
	"os"
)

// Helper function to read environment variables and return their values.
// If a variable is not set, it will exit the program with an error message.
// Used for mandatory configuration values that the application cannot run without.
func getEnvOrFail(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Environment variable %s is not set, aborting...", key)
	}
	return val
}

// Helper function to read environment variables and return their values,
// or return a default value if the variable is not set.
func getEnvOrDefault(key, defaultValue string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultValue
	}
	return val
}
