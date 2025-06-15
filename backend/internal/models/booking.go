package models

type Booking struct {
	ID        int     `json:"id"`
	StartDate string  `json:"startDate"`
	EndDate   string  `json:"endDate"`
	UserID    string  `json:"userId"`
	Status    string  `json:"status"`
	CreatedAt *string `json:"createdAt,omitempty"`
}
