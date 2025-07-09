package middleware

import (
	"net/http"

	u "github.com/pekk4/bookabike/backend/internal/utils"
)

// Middleware factory for CORS
func CORSMiddleware(cfg *u.AppConfig) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", cfg.CORSAllowedOrigins)
			w.Header().Set("Access-Control-Allow-Methods", cfg.CORSAllowedMethods)
			w.Header().Set("Access-Control-Allow-Headers", cfg.CORSAllowedHeaders)

			// Handle preflight requests
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
