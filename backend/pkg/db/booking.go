package db

import (
	"fmt"

	t "github.com/pekk4/bookabike/backend/pkg/types"
)

//
//
// Consider deploying GORM here
// https://gorm.io/
//
//

type BookingRepository interface {
	CreateBooking(b t.Booking) (t.Booking, error)
	GetAllBookings() ([]t.Booking, error)
	//GetBooking(id int) (t.Booking, error)
}

func (c conn) CreateBooking(b t.Booking) (t.Booking, error) {
	query := `
        INSERT INTO bookings (start_date, end_date, status, user_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, start_date, end_date, status, created_at
    `
	var booking t.Booking

	err := c.db.QueryRow(
		query,
		b.StartDate,
		b.EndDate,
		b.Status,
		b.UserID,
	).Scan(
		&booking.ID,
		&booking.StartDate,
		&booking.EndDate,
		&booking.Status,
		&booking.CreatedAt,
	)
	if err != nil {
		return t.Booking{}, fmt.Errorf("CreateBooking: %w", err)
	}

	return booking, nil
}

func (c conn) GetAllBookings() ([]t.Booking, error) {
	query := `SELECT id, start_date, end_date, status, user_id, created_at FROM bookings`
	rows, err := c.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("GetAllBookings: %w", err)
	}
	defer rows.Close()

	var bookings []t.Booking

	for rows.Next() {
		var booking t.Booking

		if err := rows.Scan(
			&booking.ID,
			&booking.StartDate,
			&booking.EndDate,
			&booking.Status,
			&booking.UserID,
			&booking.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("GetAllBookings: %w", err)
		}
		bookings = append(bookings, booking)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetAllBookings: %w", err)
	}
	return bookings, nil
}

func (c conn) GetBookingsByUserID(userID string) ([]t.Booking, error) {
	//log.Println("GetBookingsByUserID called with userID:", userID)
	query := `SELECT id, start_date, end_date, status, user_id, created_at FROM bookings WHERE user_id = $1`
	rows, err := c.db.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("GetBookingsByUserID: %w", err)
	}
	defer rows.Close()

	var bookings []t.Booking

	for rows.Next() {
		var booking t.Booking

		if err := rows.Scan(
			&booking.ID,
			&booking.StartDate,
			&booking.EndDate,
			&booking.Status,
			&booking.UserID,
			&booking.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("GetBookingsByUserID: %w", err)
		}
		bookings = append(bookings, booking)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("GetBookingsByUserID: %w", err)
	}
	return bookings, nil
}
