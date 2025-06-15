package services

import (
	"github.com/pekk4/bookabike/backend/internal/db"
	m "github.com/pekk4/bookabike/backend/internal/models"
)

type BookingService struct {
	Repo db.BookingRepository
}

func NewBookingService(repository db.BookingRepository) *BookingService {
	return &BookingService{Repo: repository}
}

func (s *BookingService) CreateBooking(userID string, booking m.Booking) (*m.Booking, error) {
	booking.UserID = userID

	countActiveBookings, err := s.Repo.CountActiveBookingsForUser(userID)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	if countActiveBookings > 0 {
		booking.Status = "wished"
	} else {
		booking.Status = "pending"
	}

	createdBooking, err := s.Repo.CreateBooking(booking)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}
	return &createdBooking, nil
}
