package models

import "time"

type Booking struct {
	ID        int     `json:"id"`
	StartDate string  `json:"startDate"`
	EndDate   string  `json:"endDate"`
	UserID    string  `json:"userId"`
	Status    string  `json:"status"`
	CreatedAt *string `json:"createdAt,omitempty"`
}

// PublicBooking hides sensitive information from regular users
type PublicBooking struct {
	ID int `json:"id"`
	//StartDate string `json:"startDate"`
	StartDate time.Time `json:"startDate"`
	//EndDate   string `json:"endDate"`
	EndDate time.Time `json:"endDate"`
}
