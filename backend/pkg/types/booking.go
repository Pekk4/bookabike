package types

type Booking struct {
	ID        int     `json:"id"`
	StartDate string  `json:"startDate"`
	EndDate   string  `json:"endDate"`
	UserID    string  `json:"userId"`
	CreatedAt *string `json:"createdAt,omitempty"`
}
