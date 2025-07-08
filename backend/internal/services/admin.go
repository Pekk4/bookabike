package services

import (
	"strconv"

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

func (s *AdminService) GetAllBookings() ([]m.UserDataBooking, error) {
	var results []m.Booking
	var bookings []m.UserDataBooking
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

		booking := m.UserDataBooking{
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

func (s *AdminService) UpdateBookingStatus(bookingID, bookingStatus string) (*m.UserDataBooking, error) {
	id, err := strconv.Atoi(bookingID)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	result, err := s.Repo.GetBookingByID(id)
	if err != nil {
		// TODO: error handling and logging
		//if err == db.ErrBookingNotFound {
		//	return ErrBookingNotFound
		//}
		return nil, err
	}

	user, err := s.KcClient.GetUserFullNameByID(result.UserID)
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
	updatedBooking, err := s.Repo.UpdateBookingByID(result.ID, result)
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
	}

	return &booking, nil
}
