package db

import (
	"database/sql"
	"fmt"

	t "github.com/pekk4/bookabike/backend/pkg/types"
)

//
// Consider deploying GORM here
// https://gorm.io/
//

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
		// TODO: error handling and logging
		return t.Booking{}, fmt.Errorf("CreateBooking: %w", err)
	}
	return booking, nil
}

func (c conn) GetBookings(userID string) ([]t.Booking, error) {
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

func (c conn) CountActiveBookingsForUser(userID string) (int, error) {
	var count int

	query := `SELECT COUNT(*) FROM bookings WHERE user_id = $1 AND status != 'wished'`
	err := c.db.QueryRow(query, userID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("GetUsersActiveBookingsCount: %w", err)
	}
	return count, nil
}
