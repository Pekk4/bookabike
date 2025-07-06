package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"

	u "github.com/pekk4/bookabike/backend/internal/utils"
)

type contextKey string

const (
	ContextKeyIsAdmin  = contextKey("isAdmin")
	ContextKeyIsVendor = contextKey("isVendor")
	ContextKeyUserID   = contextKey("userID")
)

func pickRoles(claims jwt.MapClaims) []string {
	// TODO: consider env variable for the key
	if roles, ok := claims["bookabike-roles"].([]any); ok {
		var result []string
		for _, role := range roles {
			if roleStr, ok := role.(string); ok {
				result = append(result, roleStr)
			}
		}
		return result
	}
	return nil
}

func pickUserID(claims jwt.MapClaims) (string, error) {
	if userID, ok := claims["sub"].(string); ok {
		return userID, nil
	}
	return "", fmt.Errorf("could not extract 'sub' claim from JWT")
}

func AuthMiddleware(next http.Handler) http.Handler {
	//
	// TODO: error handling & logging
	//
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Unauthorized: Missing token", http.StatusUnauthorized)
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Should be somewhere else, I guess???
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

		ctx := r.Context()
		ctx = context.WithValue(ctx, ContextKeyIsAdmin, false)
		ctx = context.WithValue(ctx, ContextKeyIsVendor, false)
		ctx = context.WithValue(ctx, ContextKeyUserID, "")

		// TODO: refactor/clean up
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			userID, err := pickUserID(claims)
			if err != nil {
				log.Printf("Error parsing claims: %s", err)
				http.Error(w, fmt.Sprintf("Invalid or malformed token: %s", err.Error()), http.StatusUnauthorized)
				return
			}
			ctx = context.WithValue(ctx, ContextKeyUserID, userID)

			roles := pickRoles(claims)
			for _, role := range roles {
				switch role {
				case "bookabike-admin":
					ctx = context.WithValue(ctx, ContextKeyIsAdmin, true)
				case "bookabike-vendor":
					ctx = context.WithValue(ctx, ContextKeyIsVendor, true)
				}
			}
			//fmt.Println("Claims are:", token.Claims)
		} else {
			fmt.Println("Token valid, but could not extract 'sub' claim")
		}
		r = r.WithContext(ctx)

		next.ServeHTTP(w, r)
	})
}
