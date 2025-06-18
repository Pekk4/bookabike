package services

import (
	"errors"
	"sort"

	"github.com/pekk4/bookabike/backend/internal/db"
	m "github.com/pekk4/bookabike/backend/internal/models"
)

var ErrUnauthorized = errors.New("unauthorized")
var ErrBookingNotFound = errors.New("booking not found")

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

func (s *BookingService) GetAllBookings(isAdmin bool, userID string) ([]m.Booking, error) {
	var bookings []m.Booking
	var err error

	if isAdmin {
		bookings, err = s.Repo.GetAllBookings()
	} else {
		bookings, err = s.Repo.GetAllBookingsByUserID(userID)
	}

	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}
	return bookings, nil
}

//func (s *BookingService) GetAllBookingsByUserID(userID string) ([]m.Booking, error) {
//	bookings, err := s.Repo.GetAllBookingsByUserID(userID)
//	if err != nil {
//		// TODO: error handling and logging
//		return nil, err
//	}
//	return bookings, nil
//}

// func (s *BookingService) GetAllBookedDates() ([]m.PublicBooking, error) {
func (s *BookingService) GetAllBookedDates() ([]string, error) {
	bookings, err := s.Repo.GetAllBookedDates()
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	datesMap := make(map[string]struct{})
	for _, booking := range bookings {
		start := booking.StartDate
		end := booking.EndDate

		for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
			dateStr := d.Format("Mon Jan 2 2006") // JS-like date string
			datesMap[dateStr] = struct{}{}
		}
	}

	var bookedDates []string
	for date := range datesMap {
		bookedDates = append(bookedDates, date)
	}
	sort.Strings(bookedDates) // Sort the dates

	return bookedDates, nil
}

func (s *BookingService) DeleteBookingByID(bookingID int, userID string, isAdmin bool) error {
	if isAdmin {
		err := s.Repo.DeleteBookingByID(bookingID)
		if err != nil {
			// TODO: error handling and logging
			return err
		}
		return nil
	}

	booking, err := s.Repo.GetBookingByID(bookingID)
	if err != nil {
		// TODO: error handling and logging
		return ErrBookingNotFound // AD HOC
	}

	if booking.UserID != userID {
		// If the user is not the owner of the booking, we cannot delete it
		return ErrUnauthorized
	}

	err = s.Repo.DeleteBookingByID(bookingID)
	if err != nil {
		// TODO: error handling and logging
		return err
	}
	return nil
}
