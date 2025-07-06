package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	s "github.com/pekk4/bookabike/backend/internal/services"
)

type AdminHandler struct {
	Service *s.AdminService
}

func NewAdminHandler(service *s.AdminService) *AdminHandler {
	return &AdminHandler{Service: service}
}

func (h *AdminHandler) GetAllBookings(w http.ResponseWriter, r *http.Request) {
	isAdmin := r.Context().Value(mw.ContextKeyIsAdmin).(bool)

	if !isAdmin {
		// TODO: error handling and logging
		http.Error(w, "Unauthorized: Admin access required", http.StatusUnauthorized)
		return
	}
	bookings, err := h.Service.GetAllBookings()
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error retrieving all bookings: %v", err)
		http.Error(w, "Failed to retrieve bookings", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}
