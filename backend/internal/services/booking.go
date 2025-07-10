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
	repo db.BookingRepository
}

func NewBookingService(repository db.BookingRepository) *BookingService {
	return &BookingService{repo: repository}
}

func (s *BookingService) CreateBooking(userID string, booking m.Booking) (*m.Booking, error) {
	booking.UserID = userID

	hasOverlaps, err := s.repo.HasBookingOverlap(booking.StartDate, booking.EndDate, nil)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	if hasOverlaps {
		// TODO error handling
		return nil, errors.New("booking overlaps with existing bookings")
	}

	countActiveBookings, err := s.repo.CountActiveBookingsForUser(userID)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	// User can have only one active booking at a time
	if countActiveBookings > 0 {
		booking.Status = "wished"
	} else {
		booking.Status = "pending"
	}

	createdBooking, err := s.repo.CreateBooking(booking)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}
	return &createdBooking, nil
}

func (s *BookingService) GetAllBookingsByUserID(userID string) ([]m.Booking, error) {
	bookings, err := s.repo.GetAllBookingsByUserID(userID)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}
	return bookings, nil
}

func (s *BookingService) GetAllBookedDates() ([]string, error) {
	bookings, err := s.repo.GetAllBookedDates()
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	datesMap := make(map[string]struct{})
	for _, booking := range bookings {
		start := booking.StartDate
		end := booking.EndDate

		for d := start; !d.After(end); d = d.AddDate(0, 0, 1) {
			dateStr := d.Format("Mon Jan 02 2006") // JS-like date string
			datesMap[dateStr] = struct{}{}
		}
	}

	var bookedDates []string
	for date := range datesMap {
		bookedDates = append(bookedDates, date)
	}
	sort.Strings(bookedDates)

	return bookedDates, nil
}

func (s *BookingService) DeleteBookingByID(bookingID int, userID string) error {
	booking, err := s.repo.GetBookingByID(bookingID)
	if err != nil {
		// TODO: error handling and logging
		return ErrBookingNotFound // AD HOC
		// if err == db.ErrBookingNotFound { // use this or delete it from db/booking.go
	}

	if booking.UserID != userID {
		// If the user is not the owner of the booking, we cannot delete it
		return ErrUnauthorized
	}

	err = s.repo.DeleteBookingByID(bookingID)
	if err != nil {
		// TODO: error handling and logging
		return err
	}
	return nil
}

func (s *BookingService) UpdateBookingByID(bookingID int, userID string, booking m.Booking) (*m.Booking, error) {
	refBooking, err := s.repo.GetBookingByID(bookingID)
	if err != nil {
		// TODO: error handling and logging
		return nil, ErrBookingNotFound // AD HOC
	}

	if refBooking.UserID != userID {
		// If the user is not the owner of the booking, we cannot update it
		return nil, ErrUnauthorized
	}

	// Check if the booking overlaps with existing bookings
	hasOverlaps, err := s.repo.HasBookingOverlap(booking.StartDate, booking.EndDate, &bookingID)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	if hasOverlaps {
		// TODO error handling
		return nil, errors.New("booking overlaps with existing bookings")
	}

	updatedBooking, err := s.repo.UpdateBookingByID(bookingID, booking)
	if err != nil {
		// TODO: error handling and logging
		return nil, err
	}

	return &updatedBooking, nil
}
