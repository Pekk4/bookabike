package db

// https://vektra.github.io/mockery/latest/

import (
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	m "github.com/pekk4/bookabike/backend/internal/models"
)

// Helpers
func setupMockDB(t *testing.T) (*conn, sqlmock.Sqlmock, func()) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open sqlmock database: %v", err)
	}
	c := &conn{db: db}
	return c, mock, func() { db.Close() }
}

/**
***
*** CreateBooking(b m.Booking) (m.Booking, error) test cases
***
**/
func TestCreateBooking_Success(t *testing.T) {
	c, mock, teardown := setupMockDB(t)
	defer teardown()

	input := m.Booking{
		StartDate: "2025-07-01",
		EndDate:   "2025-07-03",
		Status:    "pending",
		UserID:    "user-123",
	}

	createdAt := time.Now().Format(time.RFC3339)
	expected := m.Booking{
		ID:        1,
		StartDate: input.StartDate,
		EndDate:   input.EndDate,
		Status:    input.Status,
		UserID:    input.UserID,
		CreatedAt: createdAt,
	}

	mock.ExpectQuery(regexp.QuoteMeta(`
				INSERT INTO bookings (start_date, end_date, status, user_id)
				VALUES ($1, $2, $3, $4)
				RETURNING id, start_date, end_date, status, user_id, created_at
		`)).
		WithArgs(input.StartDate, input.EndDate, input.Status, input.UserID).
		WillReturnRows(sqlmock.NewRows([]string{
			"id", "start_date", "end_date", "status", "user_id", "created_at",
		}).AddRow(
			expected.ID, expected.StartDate, expected.EndDate, expected.Status, expected.UserID, expected.CreatedAt,
		))

	result, err := c.CreateBooking(input)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.ID != expected.ID || result.StartDate != expected.StartDate || result.EndDate != expected.EndDate {
		t.Errorf("unexpected result: got %+v, want %+v", result, expected)
	}
}

func TestCreateBooking_Error(t *testing.T) {
	c, mock, teardown := setupMockDB(t)
	defer teardown()

	input := m.Booking{
		StartDate: "2025-07-01",
		EndDate:   "2025-07-03",
		Status:    "pending",
		UserID:    "user-123",
	}

	mock.ExpectQuery(regexp.QuoteMeta(`
				INSERT INTO bookings (start_date, end_date, status, user_id)
				VALUES ($1, $2, $3, $4)
				RETURNING id, start_date, end_date, status, user_id, created_at
		`)).
		WithArgs(input.StartDate, input.EndDate, input.Status, input.UserID).
		WillReturnError(sqlmock.ErrCancelled)

	_, err := c.CreateBooking(input)
	if err == nil {
		t.Fatalf("expected error, got nil")
	}
}

/**
***
*** UpdateBookingByID(bookingID int, b m.Booking) (m.Booking, error) test cases
***
**/
func TestUpdateBookingByID_Success(t *testing.T) {
	c, mock, teardown := setupMockDB(t)
	defer teardown()

	bookingID := 1
	input := m.Booking{
		StartDate: "2025-07-01",
		EndDate:   "2025-07-03",
	}

	createdAt := time.Now().Format(time.RFC3339)
	expected := m.Booking{
		ID:        bookingID,
		StartDate: input.StartDate,
		EndDate:   input.EndDate,
		Status:    "confirmed",
		UserID:    "user-123",
		CreatedAt: createdAt,
	}

	mock.ExpectQuery(regexp.QuoteMeta(`
        UPDATE bookings
        SET start_date = $1, end_date = $2, status = $3
        WHERE id = $4
        RETURNING id, start_date, end_date, status, user_id, created_at
    `)).
		WithArgs(input.StartDate, input.EndDate, input.Status, bookingID).
		WillReturnRows(sqlmock.NewRows([]string{
			"id", "start_date", "end_date", "status", "user_id", "created_at",
		}).AddRow(
			expected.ID, expected.StartDate, expected.EndDate, expected.Status, expected.UserID, expected.CreatedAt,
		))

	result, err := c.UpdateBookingByID(bookingID, input)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.ID != expected.ID || result.StartDate != expected.StartDate || result.EndDate != expected.EndDate {
		t.Errorf("unexpected result: got %+v, want %+v", result, expected)
	}
}

func TestUpdateBookingByID_Error(t *testing.T) {
	c, mock, teardown := setupMockDB(t)
	defer teardown()

	bookingID := 1
	input := m.Booking{
		StartDate: "2025-07-01",
		EndDate:   "2025-07-03",
	}

	mock.ExpectQuery(regexp.QuoteMeta(`
        UPDATE bookings
        SET start_date = $1, end_date = $2
        WHERE id = $3
        RETURNING id, start_date, end_date, status, user_id, created_at
    `)).
		WithArgs(input.StartDate, input.EndDate, bookingID).
		WillReturnError(sqlmock.ErrCancelled)

	_, err := c.UpdateBookingByID(bookingID, input)
	if err == nil {
		t.Fatalf("expected error, got nil")
	}
}
