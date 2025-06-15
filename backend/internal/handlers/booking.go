package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/pekk4/bookabike/backend/internal/db"
	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	m "github.com/pekk4/bookabike/backend/internal/models"
	s "github.com/pekk4/bookabike/backend/internal/services"
)

type BookingHandler struct {
	Service *s.BookingService
}

func NewBookingHandler(service *s.BookingService) *BookingHandler {
	return &BookingHandler{Service: service}
}

func (h *BookingHandler) CreateBooking(w http.ResponseWriter, r *http.Request) {
	var booking m.Booking

	if err := json.NewDecoder(r.Body).Decode(&booking); err != nil {
		// TODO: error handling and logging
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID, ok := r.Context().Value(mw.ContextKeyUserID).(string)
	if !ok || userID == "" {
		// TODO: error handling and logging
		log.Println("User ID not found in context, interrupting...")
		http.Error(w, "Unauthorized: User ID not found", http.StatusUnauthorized)
		return
	}

	createdBooking, err := h.Service.CreateBooking(userID, booking)
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error creating booking: %v", err)
		http.Error(w, "Failed to create booking", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(createdBooking)
}

// TODO: changes not done yet here
func (h *BookingHandler) getBookingsHandler(w http.ResponseWriter, r *http.Request) {
	// these the fuck out of here
	dbConn := db.NewConnection()
	defer dbConn.Close()

	var (
		bookings []m.Booking
		err      error
	)

	// Admin gets all bookings
	if r.Context().Value(mw.ContextKeyIsAdmin).(bool) {
		//bookings, err = dbConn.GetAllBookings()
		bookings, err = dbConn.GetBookings("")
		if err != nil {
			log.Printf("Error retrieving bookings: %v", err)
			http.Error(w, "Failed to retrieve bookings", http.StatusInternalServerError)
			return
		}
		// Regular user gets their own bookings
	} else if r.Context().Value(mw.ContextKeyUserID) != "" {
		userID := r.Context().Value(mw.ContextKeyUserID).(string)
		//bookings, err = dbConn.GetBookingsByUserID(userID)
		bookings, err = dbConn.GetBookings(userID)
		if err != nil {
			log.Printf("Error retrieving bookings for user %s: %v", userID, err)
			http.Error(w, "Failed to retrieve bookings for user", http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}
