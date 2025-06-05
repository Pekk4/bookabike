package db

import (
	"fmt"

	t "github.com/pekk4/bookabike/backend/pkg/types"
)

type BookingRepository interface {
	CreateBooking(b t.Booking) (t.Booking, error)
	//GetBooking(id int) (t.Booking, error)
	//GetAllBookings(id int) (t.Booking, error)
}

func (c conn) CreateBooking(b t.Booking) (t.Booking, error) {
	query := `
        INSERT INTO bookings (start_date, end_date, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, start_date, end_date, created_at
    `
	var booking t.Booking

	err := c.db.QueryRow(query, b.StartDate, b.EndDate, b.UserID).Scan(&booking.ID, &booking.StartDate, &booking.EndDate, &booking.CreatedAt)
	if err != nil {
		return t.Booking{}, fmt.Errorf("CreateBooking: %w", err)
	}

	return booking, nil
}
