package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"

	s "github.com/pekk4/bookabike/backend/internal/services"
	u "github.com/pekk4/bookabike/backend/internal/utils"
)

type contextKey string

const (
	ContextKeyIsAdmin  = contextKey("isAdmin")
	ContextKeyIsVendor = contextKey("isVendor")
	ContextKeyUserID   = contextKey("userID")
)

func pickRoles(cfg *u.AppConfig, claims jwt.MapClaims) []string {
	if roles, ok := claims[cfg.AppRolesClaimName].([]any); ok {
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

// Middleware factory for authentication & authorization
func AuthMiddleware(cfg *u.AppConfig, kcClient *s.KeycloakClient) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
				// TODO: error handling & logging
				http.Error(w, "Unauthorized: Missing token", http.StatusUnauthorized)
				return
			}
			tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

			ctx := r.Context()
			ctx = context.WithValue(ctx, ContextKeyIsAdmin, false)
			ctx = context.WithValue(ctx, ContextKeyIsVendor, false)
			ctx = context.WithValue(ctx, ContextKeyUserID, "")

			claims, err := kcClient.ValidateAccessToken(tokenStr)
			if err != nil {
				// TODO: error handling & logging
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}

			userID, err := pickUserID(claims)
			if err != nil {
				// TODO: error handling & logging
				log.Printf("Error parsing claims: %s", err)
				http.Error(w, fmt.Sprintf("Invalid or malformed token: %s", err.Error()), http.StatusUnauthorized)
				return
			}
			ctx = context.WithValue(ctx, ContextKeyUserID, userID)

			roles := pickRoles(cfg, claims)
			for _, role := range roles {
				switch role {
				case cfg.AppAdminRoleName:
					ctx = context.WithValue(ctx, ContextKeyIsAdmin, true)
				case cfg.AppVendorRoleName:
					ctx = context.WithValue(ctx, ContextKeyIsVendor, true)
				}
			}

			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
