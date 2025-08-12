package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/MicahParks/keyfunc/v3"
	"github.com/golang-jwt/jwt/v5"

	m "github.com/pekk4/bookabike/backend/internal/models"
	u "github.com/pekk4/bookabike/backend/internal/utils"
)

// KeycloakClient is basically a Keycloak service, which is responsible for
// handling Keycloak related operations such as fetching user profiles handling tokens.
type KeycloakClient struct {
	cfg *u.AppConfig
}

func NewKeycloakClient(cfg *u.AppConfig) *KeycloakClient {
	return &KeycloakClient{cfg: cfg}
}

func (c *KeycloakClient) FetchUserProfileByID(userID string) (m.User, error) {
	// Fetch a fresh access token
	accessToken, err := c.FetchAccessToken()
	if err != nil {
		return m.User{}, fmt.Errorf("failed to fetch admin token: %w", err)
	}

	endpoint := fmt.Sprintf(
		"%s/admin/realms/%s/users/%s", c.cfg.KeycloakBaseURL, c.cfg.KeycloakRealm, userID)
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		return m.User{}, err
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return m.User{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return m.User{}, fmt.Errorf("failed to fetch user: %s", resp.Status)
	}

	var kcUser struct {
		ID        string `json:"id"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Username  string `json:"username"`
		Email     string `json:"email"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&kcUser); err != nil {
		return m.User{}, err
	}

	return m.User{
		ID:        kcUser.ID,
		FirstName: kcUser.FirstName,
		LastName:  kcUser.LastName,
		UserName:  kcUser.Username,
		Email:     kcUser.Email,
	}, nil
}

func (c *KeycloakClient) FetchAccessToken() (string, error) {
	tokenURL := fmt.Sprintf(
		"%s/realms/%s/protocol/openid-connect/token", c.cfg.KeycloakBaseURL, c.cfg.KeycloakRealm)

	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", c.cfg.KeycloakClientID)
	data.Set("client_secret", c.cfg.KeycloakClientSecret)

	req, err := http.NewRequest("POST", tokenURL, bytes.NewBufferString(data.Encode()))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("failed to fetch access token: %s, %s", resp.Status, string(body))
	}

	var tokenResp struct {
		AccessToken string `json:"access_token"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", err
	}

	return tokenResp.AccessToken, nil
}

func (c *KeycloakClient) ValidateAccessToken(tokenStr string) (jwt.MapClaims, error) {
	baseURL := strings.TrimRight(c.cfg.KeycloakBaseURL, "/")
	realm := c.cfg.KeycloakRealm
	jwksURL := fmt.Sprintf("%s/realms/%s/protocol/openid-connect/certs", baseURL, realm)

	jwks, err := keyfunc.NewDefault([]string{jwksURL})
	if err != nil {
		log.Printf("Failed to create JWK Set.\nError: %s", err)
		return nil, err
	}

	token, err := jwt.Parse(tokenStr, jwks.Keyfunc)
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid or malformed token: %w", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("could not extract claims")
	}

	return claims, nil
}
