package middleware

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"

	u "github.com/pekk4/bookabike/backend/pkg/utils"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Unauthorized: Missing token", http.StatusUnauthorized)
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		baseURL := u.GetEnvOrFail("KEYCLOAK_BASE_URL") // TODO: consider handling trailing slash here somehow
		realm := u.GetEnvOrFail("KEYCLOAK_REALM")
		jwksURL := fmt.Sprintf("%s/realms/%s/protocol/openid-connect/certs", baseURL, realm)

		jwks, err := keyfunc.NewDefault([]string{jwksURL})
		if err != nil {
			log.Printf("Failed to create JWK Set.\nError: %s", err)
			http.Error(w, fmt.Sprintf("Invalid or malformed token: %s", err.Error()), http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(tokenStr, jwks.Keyfunc)
		if err != nil {
			log.Printf("Failed to parse the JWT.\nError: %s", err)
			http.Error(w, fmt.Sprintf("Invalid or malformed token: %s", err.Error()), http.StatusUnauthorized)
			return
		}

		if !token.Valid {
			log.Printf("The token is not valid.")
			http.Error(w, "Invalid or malformed token.", http.StatusUnauthorized)
			return
		}

		//fmt.Println("Token valid:", token.Claims)
		next.ServeHTTP(w, r)
	})
}
