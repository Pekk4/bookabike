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
	GetAllBookings() ([]m.Booking, error)
	GetAllBookingsByUserID(userID string) ([]m.Booking, error)
	CountActiveBookingsForUser(userID string) (int, error)
	GetAllBookedDates() ([]m.PublicBooking, error)
	DeleteBookingByID(bookingID int) error
	GetBookingByID(bookingID int) (m.Booking, error)
	HasBookingOverlap(startDate, endDate string, excludeBookingID *int) (bool, error)
	UpdateBookingByID(bookingID int, b m.Booking) (m.Booking, error)
}

func (c *conn) CreateBooking(b m.Booking) (m.Booking, error) {
	query := `
		INSERT INTO bookings (start_date, end_date, status, user_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, start_date, end_date, status, created_at
	`
	var booking m.Booking

	if err := c.db.QueryRow(
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
	); err != nil {
		//if err != nil {
		// TODO: error handling and logging
		return m.Booking{}, fmt.Errorf("CreateBooking: %w", err)
	}
	return booking, nil
}

func (c *conn) GetAllBookings() ([]m.Booking, error) {
	query := `
		SELECT id, start_date, end_date, status, user_id, created_at
		FROM bookings
	`
	rows, err := c.db.Query(query)
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

func (c *conn) GetAllBookingsByUserID(userID string) ([]m.Booking, error) {
	query := `
		SELECT id, start_date, end_date, status, user_id, created_at
		FROM bookings
		WHERE user_id = $1
	`
	rows, err := c.db.Query(query, userID)
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
	if err := c.db.QueryRow(query, userID).Scan(&count); err != nil {
		return 0, fmt.Errorf("GetUsersActiveBookingsCount: %w", err)
	}

	return count, nil
}

func (c *conn) GetAllBookedDates() ([]m.PublicBooking, error) {
	query := `
		SELECT id, start_date, end_date
		FROM bookings
	`
	//	WHERE status = 'confirmed'
	//`
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

func (c *conn) DeleteBookingByID(bookingID int) error {
	query := `DELETE FROM bookings WHERE id = $1`
	_, err := c.db.Exec(query, bookingID)
	if err != nil {
		// TODO: error handling and logging
		return fmt.Errorf("DeleteBookingByID: %w", err)
	}
	return nil
}

func (c *conn) GetBookingByID(bookingID int) (m.Booking, error) {
	query := `
		SELECT id, start_date, end_date, status, user_id, created_at
		FROM bookings
		WHERE id = $1
	`
	var booking m.Booking

	if err := c.db.QueryRow(query, bookingID).Scan(
		&booking.ID,
		&booking.StartDate,
		&booking.EndDate,
		&booking.Status,
		&booking.UserID,
		&booking.CreatedAt,
	); err != nil {
		if err == sql.ErrNoRows {
			return m.Booking{}, fmt.Errorf("GetBookingByID: booking with ID %d not found", bookingID)
		}
		return m.Booking{}, fmt.Errorf("GetBookingByID: %w", err)
	}
	return booking, nil
}

func (c *conn) HasBookingOverlap(startDate, endDate string, excludeBookingID *int) (bool, error) {
	query := `
		SELECT 1 FROM bookings
		WHERE NOT (
				$2 < start_date OR $1 > end_date
		)
	`
	args := []any{startDate, endDate}
	if excludeBookingID != nil {
		// When updating a booking, we want to exclude the current booking from the overlap results
		query += " AND id != $3"
		args = append(args, *excludeBookingID)
	}
	query += " LIMIT 1"

	var exists int

	if err := c.db.QueryRow(query, args...).Scan(&exists); err != nil {
		if err == sql.ErrNoRows {
			return false, nil // No overlap found
		}
		return false, err
	}

	return true, nil // Overlap found
}

func (c *conn) UpdateBookingByID(bookingID int, b m.Booking) (m.Booking, error) {
	query := `
		UPDATE bookings
		SET start_date = $1, end_date = $2
		WHERE id = $3
		RETURNING id, start_date, end_date, status, user_id, created_at
	`
	var updated m.Booking

	// TODO: decide the representation of err/nil conditional, not sure which one is more clear
	if err := c.db.QueryRow(
		query,
		b.StartDate,
		b.EndDate,
		bookingID,
	).Scan(
		&updated.ID,
		&updated.StartDate,
		&updated.EndDate,
		&updated.Status,
		&updated.UserID,
		&updated.CreatedAt,
	); err != nil {
		return m.Booking{}, fmt.Errorf("UpdateBooking: %w", err)
	}

	return updated, nil
}
