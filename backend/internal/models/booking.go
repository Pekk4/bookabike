package models

import "time"

// Regular booking object used in regular booking operations
type Booking struct {
	ID           int     `json:"id"`
	StartDate    string  `json:"startDate"`
	EndDate      string  `json:"endDate"`
	UserID       string  `json:"userId"`
	Status       string  `json:"status"`
	CreatedAt    string  `json:"createdAt"`
	ActionReason *string `json:"reason,omitempty"`
}

// BookingDates object is used to represent just bookings dates
type BookingDates struct {
	ID        int       `json:"id"`
	StartDate time.Time `json:"startDate"`
	EndDate   time.Time `json:"endDate"`
}

// UserDataBooking is used for admins to get all bookings with user data
type UserDataBooking struct {
	ID           int     `json:"id"`
	User         User    `json:"user"`
	StartDate    string  `json:"startDate"`
	EndDate      string  `json:"endDate"`
	Status       string  `json:"status"`
	CreatedAt    string  `json:"createdAt"`
	ActionReason *string `json:"reason,omitempty"`
}

// BookingAction represents an action taken on a booking, such as confirmation or cancellation
type BookingAction struct {
	ID         int       `json:"id"`
	BookingID  int       `json:"bookingId"`
	ActionType string    `json:"actionType"`
	Reason     string    `json:"reason"`
	CreatedAt  time.Time `json:"createdAt"`
}
