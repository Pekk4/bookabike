package models

import "time"

type Booking struct {
	ID           int     `json:"id"`
	StartDate    string  `json:"startDate"`
	EndDate      string  `json:"endDate"`
	UserID       string  `json:"userId"`
	Status       string  `json:"status"`
	CreatedAt    string  `json:"createdAt"`
	ActionReason *string `json:"reason,omitempty"`
}

type BookingDates struct {
	ID        int       `json:"id"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

type UserDataBooking struct {
	ID           int     `json:"id"`
	User         User    `json:"user"`
	StartDate    string  `json:"startDate"`
	EndDate      string  `json:"endDate"`
	Status       string  `json:"status"`
	CreatedAt    string  `json:"createdAt"`
	ActionReason *string `json:"reason,omitempty"`
}

type BookingAction struct {
	ID         int       `json:"id"`
	BookingID  int       `json:"bookingId"`
	ActionType string    `json:"actionType"`
	Reason     string    `json:"reason"`
	CreatedAt  time.Time `json:"createdAt"`
}
