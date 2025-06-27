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

//var ErrUnauthorized = errors.New("unauthorized")
//var ErrBookingNotFound = errors.New("booking not found")

type UserService struct {
	KeycloakBaseURL string
	Realm           string
	ClientID        string
	ClientSecret    string
}

func NewUserService(baseURL, realm, clientID, clientSecret string) *UserService {
	return &UserService{
		KeycloakBaseURL: baseURL,
		Realm:           realm,
		ClientID:        clientID,
		ClientSecret:    clientSecret,
	}
}

//func (s *BookingService) CreateBooking(userID string, booking m.Booking) (*m.Booking, error) {
//	return &createdBooking, nil
//}

func (s *UserService) GetUserFullNameByID(userID string) (m.User, error) {
	// Fetch a fresh admin token
	token, err := s.FetchAdminToken()
	if err != nil {
		return m.User{}, fmt.Errorf("failed to fetch admin token: %w", err)
	}
	adminToken := token

	url := fmt.Sprintf("%s/admin/realms/%s/users/%s", s.KeycloakBaseURL, s.Realm, userID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return m.User{}, err
	}
	req.Header.Set("Authorization", "Bearer "+adminToken)

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

func (s *UserService) FetchAdminToken() (string, error) {
	tokenURL := fmt.Sprintf("%s/realms/%s/protocol/openid-connect/token", s.KeycloakBaseURL, s.Realm)

	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", s.ClientID)
	data.Set("client_secret", s.ClientSecret)

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
		return "", fmt.Errorf("failed to fetch admin token: %s, %s", resp.Status, string(body))
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
