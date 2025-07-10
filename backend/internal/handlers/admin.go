package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	s "github.com/pekk4/bookabike/backend/internal/services"
)

type AdminHandler struct {
	service *s.AdminService
}

type UpdateBookingPayload struct {
	Status string `json:"status"`
}

func NewAdminHandler(service *s.AdminService) *AdminHandler {
	return &AdminHandler{service: service}
}

func (h *AdminHandler) GetAllBookings(w http.ResponseWriter, r *http.Request) {
	isAdmin, ok := r.Context().Value(mw.ContextKeyIsAdmin).(bool)
	if !ok || !isAdmin {
		// TODO: error handling and logging
		http.Error(w, "Unauthorized: Admin access required", http.StatusUnauthorized)
		return
	}

	bookings, err := h.service.GetAllBookings()
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error retrieving all bookings: %v", err)
		http.Error(w, "Failed to retrieve bookings", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}

func (h *AdminHandler) UpdateBookingStatus(w http.ResponseWriter, r *http.Request) {
	isAdmin, ok := r.Context().Value(mw.ContextKeyIsAdmin).(bool)
	if !ok || !isAdmin {
		// TODO: error handling and logging
		http.Error(w, "Unauthorized: Admin access required", http.StatusUnauthorized)
		return
	}

	idStr := mux.Vars(r)["id"]
	bookingID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Booking ID is required", http.StatusBadRequest)
		return
	}

	var payload UpdateBookingPayload

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		// TODO: error handling and logging
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	updatedBooking, err := h.service.UpdateBookingStatus(bookingID, payload.Status)
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error confirming booking with ID %d: %v", bookingID, err)
		if err == s.ErrBookingNotFound {
			http.Error(w, "Booking not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to confirm booking", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedBooking)
}
