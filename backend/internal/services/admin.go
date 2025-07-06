package services

import (
	"github.com/pekk4/bookabike/backend/internal/db"
	m "github.com/pekk4/bookabike/backend/internal/models"
)

type AdminService struct {
	Repo     db.BookingRepository
	KcClient *KeycloakClient
}

func NewAdminService(bookingRepo db.BookingRepository, client *KeycloakClient) *AdminService {
	return &AdminService{Repo: bookingRepo, KcClient: client}
}

func (s *AdminService) GetAllBookings() ([]m.DetailedBooking, error) {
	var results []m.Booking
	var bookings []m.DetailedBooking
	var err error

	results, err = s.Repo.GetAllBookings()
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	for _, result := range results {
		user, err := s.KcClient.GetUserFullNameByID(result.UserID)
		if err != nil {
			// TODO: error handling and logging
			return nil, err
		}

		booking := m.DetailedBooking{
			ID:        result.ID,
			User:      user,
			StartDate: result.StartDate,
			EndDate:   result.EndDate,
			Status:    result.Status,
			//CreatedAt: result.CreatedAt,
		}
		bookings = append(bookings, booking)
	}

	return bookings, nil
}
