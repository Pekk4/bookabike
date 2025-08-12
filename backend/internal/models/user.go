package models

// User represents an user related to bookings
// Used to provide user data within booking objects for admin purposes
type User struct {
	ID        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	UserName  string `json:"username"`
	Email     string `json:"email"`
}
