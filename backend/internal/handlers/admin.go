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

// AdminHandler handles all the HTTP requests sent to the /admin endpoints.
// It provides methods that are assigned to spesific routes in endpoint configuration.
// It checks the permission information provided by the middleware and calls appropriate service layer
// methods to perform the actual business logic.
type AdminHandler struct {
	adminService  *s.AdminService
	actionService *s.BookingActionService
}

type UpdateBookingPayload struct {
	Status string  `json:"status"`
	Reason *string `json:"reason,omitempty"`
}

func NewAdminHandler(adminService *s.AdminService, actionService *s.BookingActionService) *AdminHandler {
	return &AdminHandler{adminService: adminService, actionService: actionService}
}

func (h *AdminHandler) GetAllBookings(w http.ResponseWriter, r *http.Request) {
	isAdmin, ok := r.Context().Value(mw.ContextKeyIsAdmin).(bool)
	if !ok || !isAdmin {
		http.Error(w, "Unauthorized: Admin access required", http.StatusUnauthorized)
		return
	}

	bookings, err := h.adminService.GetAllBookings()
	if err != nil {
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
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	updatedBooking, err := h.adminService.UpdateBookingStatus(bookingID, payload.Status)
	if err != nil {
		log.Printf("Error confirming booking with ID %d: %v", bookingID, err)
		if err == s.ErrBookingNotFound {
			http.Error(w, "Booking not found", http.StatusNotFound)
		} else {
			http.Error(w, "Failed to confirm booking", http.StatusInternalServerError)
		}
		return
	}

	if payload.Status == "rejected" || payload.Status == "revoked" {
		if payload.Reason == nil || *payload.Reason == "" {
			// NOTE: Reason is mandatory for admins
			http.Error(w, "Reason is required for this status", http.StatusBadRequest)
			return
		} else {
			newAction := m.BookingAction{
				BookingID:  bookingID,
				ActionType: payload.Status,
				Reason:     *payload.Reason,
			}

			bookingAction, err := h.actionService.CreateBookingAction(newAction)
			if err != nil {
				log.Printf("Error creating booking action: %v", err)
				http.Error(w, "Failed to create booking action", http.StatusInternalServerError)
				return
			}

			updatedBooking.ActionReason = &bookingAction.Reason
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedBooking)
}
