package services

import (
	"github.com/pekk4/bookabike/backend/internal/db"
	m "github.com/pekk4/bookabike/backend/internal/models"
)

type AdminService struct {
	repo     db.BookingRepository
	kcClient *KeycloakClient
}

func NewAdminService(bookingRepo db.BookingRepository, client *KeycloakClient) *AdminService {
	return &AdminService{repo: bookingRepo, kcClient: client}
}

func (s *AdminService) GetAllBookings() ([]m.UserDataBooking, error) {
	var results []m.Booking
	var bookings []m.UserDataBooking
	var err error

	results, err = s.repo.GetAllBookings()
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	for _, result := range results {
		// Could be cached, but only one active booking per user, so not necessary
		user, err := s.kcClient.FetchUserProfileByID(result.UserID)
		if err != nil {
			// TODO: error handling and logging
			return nil, err
		}

		booking := m.UserDataBooking{
			ID:        result.ID,
			User:      user,
			StartDate: result.StartDate,
			EndDate:   result.EndDate,
			Status:    result.Status,
			CreatedAt: result.CreatedAt,
		}
		bookings = append(bookings, booking)
	}

	return bookings, nil
}

func (s *AdminService) UpdateBookingStatus(bookingID int, bookingStatus string) (*m.UserDataBooking, error) {
	result, err := s.repo.GetBookingByID(bookingID)
	if err != nil {
		// TODO: error handling and logging
		//if err == db.ErrBookingNotFound {
		//	return ErrBookingNotFound
		//}
		return nil, err
	}

	user, err := s.kcClient.FetchUserProfileByID(result.UserID)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}
	//if booking.Status != "pending" && booking.Status != "confirmed" {
	//	// TODO: error handling and logging
	//	// ErrUnauthorized for PoC placeholding
	//	return nil, ErrUnauthorized
	//}

	result.Status = bookingStatus
	updatedBooking, err := s.repo.UpdateBookingByID(result.ID, result)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	booking := m.UserDataBooking{
		ID:        updatedBooking.ID,
		User:      user,
		StartDate: updatedBooking.StartDate,
		EndDate:   updatedBooking.EndDate,
		Status:    updatedBooking.Status,
		//CreatedAt: updatedBooking.CreatedAt,
		CreatedAt: updatedBooking.CreatedAt,
	}

	return &booking, nil
}
