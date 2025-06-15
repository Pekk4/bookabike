package utils

import (
	"log"
	"os"
)

func GetEnvOrFail(key string) string {
	val := os.Getenv(key)
	if val == "" {
		log.Fatalf("Environment variable %s is not set, aborting...", key)
	}
	return val
}
