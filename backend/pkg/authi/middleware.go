package authi

import (
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// Keycloak configuration
const keycloakCertsURL = "http://localhost:8080/realms/testi/protocol/openid-connect/certs"

// Fetches the public key from Keycloak
func FetchPublicKey() ([]byte, error) {
	resp, err := http.Get(keycloakCertsURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch public key: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	return body, nil
}

// Extracts the RSA public key from Keycloak's JWKS response
func GetRSAPublicKey(jwksJSON []byte) (*x509.Certificate, error) {
	var jwks struct {
		Keys []struct {
			Alg string   `json:"alg"`
			X5c []string `json:"x5c"`
		} `json:"keys"`
	}

	if err := json.Unmarshal(jwksJSON, &jwks); err != nil {
		return nil, fmt.Errorf("failed to parse JWKS: %w", err)
	}

	// Find the RS256 signing key
	for _, key := range jwks.Keys {
		if key.Alg == "RS256" && len(key.X5c) > 0 {
			pemKey := fmt.Sprintf("-----BEGIN CERTIFICATE-----\n%s\n-----END CERTIFICATE-----", key.X5c[0])

			block, _ := pem.Decode([]byte(pemKey))
			if block == nil {
				return nil, fmt.Errorf("failed to decode PEM block")
			}

			cert, err := x509.ParseCertificate(block.Bytes)
			if err != nil {
				return nil, fmt.Errorf("failed to parse x509 certificate: %w", err)
			}

			return cert, nil
		}
	}

	return nil, fmt.Errorf("RS256 key not found in JWKS")
}

// Middleware to validate JWT
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Unauthorized: Missing token", http.StatusUnauthorized)
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		// Fetch public key on every request
		jwksJSON, err := FetchPublicKey()
		if err != nil {
			http.Error(w, fmt.Sprintf("Error fetching public key: %v", err), http.StatusInternalServerError)
			return
		}

		cert, err := GetRSAPublicKey(jwksJSON)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error extracting public key: %v", err), http.StatusInternalServerError)
			return
		}

		publicKey := cert.PublicKey

		// Verify the JWT
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return publicKey, nil
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("Invalid token: %v", err), http.StatusUnauthorized)
			return
		}

		fmt.Println("Token valid:", token.Claims)
		next.ServeHTTP(w, r)
	})
}
