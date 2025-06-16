package db

import (
	"database/sql"
	"fmt"

	m "github.com/pekk4/bookabike/backend/internal/models"
)

//
// Consider deploying GORM here
// https://gorm.io/
//

type BookingRepository interface {
	CreateBooking(b m.Booking) (m.Booking, error)
	GetAllBookings(userID string) ([]m.Booking, error)
	CountActiveBookingsForUser(userID string) (int, error)
	GetAllBookedDates() ([]m.PublicBooking, error)
}

func (c *conn) CreateBooking(b m.Booking) (m.Booking, error) {
	query := `
		INSERT INTO bookings (start_date, end_date, status, user_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, start_date, end_date, status, created_at
	`
	var booking m.Booking

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
		// TODO: error handling and logging
		return m.Booking{}, fmt.Errorf("CreateBooking: %w", err)
	}
	return booking, nil
}

func (c *conn) GetAllBookings(userID string) ([]m.Booking, error) {
	var rows *sql.Rows
	var err error

	query := `
		SELECT id, start_date, end_date, status, user_id, created_at
		FROM bookings
	`
	if userID == "" {
		rows, err = c.db.Query(query)
	} else {
		query += " WHERE user_id = $1"
		rows, err = c.db.Query(query, userID)
	}

	if err != nil {
		// TODO: error handling and logging
		return nil, fmt.Errorf("GetBookings: %w", err)
	}
	defer rows.Close()

	var bookings []m.Booking

	for rows.Next() {
		var booking m.Booking

		if err := rows.Scan(
			&booking.ID,
			&booking.StartDate,
			&booking.EndDate,
			&booking.Status,
			&booking.UserID,
			&booking.CreatedAt,
		); err != nil {
			// TODO: error handling and logging
			return nil, fmt.Errorf("GetBookings: %w", err)
		}
		bookings = append(bookings, booking)
	}
	if err := rows.Err(); err != nil {
		// TODO: error handling and logging
		return nil, fmt.Errorf("GetBookings: %w", err)
	}
	return bookings, nil
}

func (c *conn) CountActiveBookingsForUser(userID string) (int, error) {
	var count int

	query := `SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status != 'wished'`
	err := c.db.QueryRow(query, userID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("GetUsersActiveBookingsCount: %w", err)
	}
	return count, nil
}

func (c *conn) GetAllBookedDates() ([]m.PublicBooking, error) {
	query := `
		SELECT id, start_date, end_date
		FROM bookings
		WHERE status = 'confirmed'
	`
	rows, err := c.db.Query(query)
	if err != nil {
		// TODO: error handling and logging
		return nil, fmt.Errorf("GetAllBookingDates: %w", err)
	}
	defer rows.Close()

	var bookings []m.PublicBooking

	for rows.Next() {
		var booking m.PublicBooking

		if err := rows.Scan(
			&booking.ID,
			&booking.StartDate,
			&booking.EndDate,
		); err != nil {
			// TODO: error handling and logging
			return nil, fmt.Errorf("GetAllBookingDates: %w", err)
		}
		bookings = append(bookings, booking)
	}
	if err := rows.Err(); err != nil {
		// TODO: error handling and logging
		return nil, fmt.Errorf("GetAllBookingDates: %w", err)
	}
	return bookings, nil
}
