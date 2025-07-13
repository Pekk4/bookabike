package services

import (
	"github.com/pekk4/bookabike/backend/internal/db"
	m "github.com/pekk4/bookabike/backend/internal/models"
)

type BookingActionService struct {
	repo db.BookingActionRepository
}

func NewBookingActionService(repo db.BookingActionRepository) *BookingActionService {
	return &BookingActionService{repo: repo}
}

func (s *BookingActionService) CreateBookingAction(a m.BookingAction) (*m.BookingAction, error) {
	createdAction, err := s.repo.CreateAction(a)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}
	return &createdAction, nil
}
