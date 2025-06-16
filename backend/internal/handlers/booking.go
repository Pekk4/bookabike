package handlers

import (
	"encoding/json"
	"log"
	"net/http"

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

func (h *BookingHandler) GetAllBookings(w http.ResponseWriter, r *http.Request) {
	// TODO: should we need to check this as well?
	isAdmin := r.Context().Value(mw.ContextKeyIsAdmin).(bool)
	userID, ok := r.Context().Value(mw.ContextKeyUserID).(string)
	if !ok || userID == "" {
		// TODO: error handling and logging
		log.Println("User ID not found in context, interrupting...")
		http.Error(w, "Unauthorized: User ID not found", http.StatusUnauthorized)
		return
	}

	bookings, err := h.Service.GetAllBookings(isAdmin, userID)
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error retrieving all bookings: %v", err)
		http.Error(w, "Failed to retrieve bookings", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}

func (h *BookingHandler) GetAllBookedDates(w http.ResponseWriter, r *http.Request) {
	bookedDates, err := h.Service.GetAllBookedDates()
	if err != nil {
		//TODO: error handling and logging
		log.Printf("Error retrieving all booked dates: %v", err)
		http.Error(w, "Failed to retrieve booked dates", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookedDates)
}
