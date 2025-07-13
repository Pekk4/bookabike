package db

import (
	"fmt"

	m "github.com/pekk4/bookabike/backend/internal/models"
)

type BookingActionRepository interface {
	CreateAction(a m.BookingAction) (m.BookingAction, error)
}

func (c *conn) CreateAction(a m.BookingAction) (m.BookingAction, error) {
	query := `
		INSERT INTO booking_actions (booking_id, action_type, reason)
		VALUES ($1, $2, $3)
		RETURNING id, booking_id, action_type, reason, created_at
	`
	var action m.BookingAction

	if err := c.db.QueryRow(
		query,
		a.BookingID,
		a.ActionType,
		a.Reason,
	).Scan(
		&action.ID,
		&action.BookingID,
		&action.ActionType,
		&action.Reason,
		&action.CreatedAt,
	); err != nil {
		return m.BookingAction{}, fmt.Errorf("CreateAction: %w", err)
	}
	return action, nil
}
