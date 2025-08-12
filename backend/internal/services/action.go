package services

import (
	"github.com/pekk4/bookabike/backend/internal/db"
	m "github.com/pekk4/bookabike/backend/internal/models"
)

// BookingActionService is responsible for handling booking actions related logic.
type BookingActionService struct {
	repo db.BookingActionRepository
}

func NewBookingActionService(repo db.BookingActionRepository) *BookingActionService {
	return &BookingActionService{repo: repo}
}

func (s *BookingActionService) CreateBookingAction(a m.BookingAction) (*m.BookingAction, error) {
	createdAction, err := s.repo.CreateAction(a)
	if err != nil {
		return nil, err
	}
	return &createdAction, nil
}
