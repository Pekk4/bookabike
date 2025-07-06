package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	m "github.com/pekk4/bookabike/backend/internal/models"
)

type KeycloakClient struct {
	KeycloakBaseURL string
	Realm           string
	ClientID        string
	ClientSecret    string
}

func NewKeycloakClient(baseURL, realm, clientID, clientSecret string) *KeycloakClient {
	return &KeycloakClient{
		KeycloakBaseURL: baseURL,
		Realm:           realm,
		ClientID:        clientID,
		ClientSecret:    clientSecret,
	}
}

func (c *KeycloakClient) GetUserFullNameByID(userID string) (m.User, error) {
	// Fetch a fresh access token
	accessToken, err := c.FetchAccessToken()
	if err != nil {
		return m.User{}, fmt.Errorf("failed to fetch admin token: %w", err)
	}

	endpoint := fmt.Sprintf("%s/admin/realms/%s/users/%s", c.KeycloakBaseURL, c.Realm, userID)
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
	tokenURL := fmt.Sprintf("%s/realms/%s/protocol/openid-connect/token", c.KeycloakBaseURL, c.Realm)

	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", c.ClientID)
	data.Set("client_secret", c.ClientSecret)

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
		ExpiresIn   int    `json:"expires_in"`
		TokenType   string `json:"token_type"`
		Scope       string `json:"scope"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", err
	}

	return tokenResp.AccessToken, nil
}
