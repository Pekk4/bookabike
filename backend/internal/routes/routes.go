package routes

import (
	"github.com/gorilla/mux"

	h "github.com/pekk4/bookabike/backend/internal/handlers"
)

type Handlers struct {
	BookingHandler *h.BookingHandler
	AdminHandler   *h.AdminHandler
}

func RegisterRoutes(h *Handlers) *mux.Router {
	r := mux.NewRouter()

	//r.HandleFunc("/api/ping", h.Healthcheck).Methods("GET")

	// Manage bookings
	r.HandleFunc("/api/booking", h.BookingHandler.CreateBooking).Methods("POST")
	r.HandleFunc("/api/booking/{id}", h.BookingHandler.UpdateBookingByID).Methods("PUT")
	r.HandleFunc("/api/booking/{id}", h.BookingHandler.DeleteBookingByID).Methods("DELETE")

	// Calendar
	r.HandleFunc("/api/calendar", h.BookingHandler.GetAllBookedDates).Methods("GET")

	// User bookings
	r.HandleFunc("/api/me", h.BookingHandler.GetAllBookingsByUserID).Methods("GET")

	// Admin bookings
	r.HandleFunc("/api/admin/booking", h.AdminHandler.GetAllBookings).Methods("GET")
	r.HandleFunc("/api/admin/booking/{id}/edit", h.AdminHandler.UpdateBookingStatus).Methods("POST")

	return r
}
