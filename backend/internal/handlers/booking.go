package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	m "github.com/pekk4/bookabike/backend/internal/models"
	s "github.com/pekk4/bookabike/backend/internal/services"
)

type BookingHandler struct {
	service *s.BookingService
}

func NewBookingHandler(service *s.BookingService) *BookingHandler {
	return &BookingHandler{service: service}
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

	createdBooking, err := h.service.CreateBooking(userID, booking)
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error creating booking: %v", err)
		http.Error(w, "Failed to create booking", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(createdBooking)
}

func (h *BookingHandler) GetAllBookingsByUserID(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(mw.ContextKeyUserID).(string)
	if !ok || userID == "" {
		// TODO: error handling and logging
		log.Println("User ID not found in context, interrupting...")
		http.Error(w, "Unauthorized: User ID not found", http.StatusUnauthorized)
		return
	}

	bookings, err := h.service.GetAllBookingsByUserID(userID)
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
	bookedDates, err := h.service.GetAllBookedDates()
	if err != nil {
		//TODO: error handling and logging
		log.Printf("Error retrieving all booked dates: %v", err)
		http.Error(w, "Failed to retrieve booked dates", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookedDates)
}

func (h *BookingHandler) DeleteBookingByID(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	bookingID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Booking ID is required", http.StatusBadRequest)
		return
	}

	userID := r.Context().Value(mw.ContextKeyUserID).(string)

	err = h.service.DeleteBookingByID(bookingID, userID)
	if err != nil {
		// TODO: error handling and logging
		switch err {
		case s.ErrBookingNotFound:
			http.Error(w, "Booking not found", http.StatusNotFound)
		case s.ErrUnauthorized:
			http.Error(w, "Unauthorized to delete this booking", http.StatusUnauthorized)
		default:
			log.Printf("Error deleting booking: %v", err)
			http.Error(w, "Failed to delete booking", http.StatusInternalServerError)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *BookingHandler) UpdateBookingByID(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	bookingID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Booking ID is required", http.StatusBadRequest)
		return
	}

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

	updatedBooking, err := h.service.UpdateBookingByID(bookingID, userID, booking)
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error creating booking: %v", err)
		http.Error(w, "Failed to create booking", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedBooking)
}
