package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	"github.com/pekk4/bookabike/backend/internal/db"
	h "github.com/pekk4/bookabike/backend/internal/handlers"
	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	s "github.com/pekk4/bookabike/backend/internal/services"
	u "github.com/pekk4/bookabike/backend/internal/utils"
)

func main() {
	c := db.NewConnection()
	err := c.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer c.Close()

	// What the hell man??
	var repo db.BookingRepository = c
	bookingService := s.NewBookingService(repo)
	userService := s.NewUserService(
		u.GetEnvOrFail("KEYCLOAK_BASE_URL"),
		u.GetEnvOrFail("KEYCLOAK_REALM"),
		u.GetEnvOrFail("KEYCLOAK_CLIENT_ID"),
		u.GetEnvOrFail("KEYCLOAK_CLIENT_SECRET"),
	)
	bookingHandler := h.NewBookingHandler(bookingService, userService)

	r := mux.NewRouter()
	r.HandleFunc("/api/ping", h.Healthcheck).Methods("GET")
	r.HandleFunc("/api/booking", bookingHandler.CreateBooking).Methods("POST")
	// This will be moved under /admin later
	r.HandleFunc("/api/booking", bookingHandler.GetAllBookings).Methods("GET")

	r.HandleFunc("/api/booking/{id}", bookingHandler.DeleteBookingByID).Methods("DELETE")

	r.HandleFunc("/api/calendar", bookingHandler.GetAllBookedDates).Methods("GET")

	r.HandleFunc("/api/me", bookingHandler.GetAllBookings).Methods("GET")

	r.HandleFunc("/api/booking/{id}", bookingHandler.UpdateBookingByID).Methods("PUT")

	// CORS preflight requests
	//r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	//	if r.Method == "OPTIONS" {
	//		w.WriteHeader(http.StatusNoContent)
	//		return
	//	}
	//}).Methods("OPTIONS")

	handler := mw.CORSMiddleware(mw.AuthMiddleware(r))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running on :%s\n", port)
	// TODO: implement a graceful shutdown mechanism
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
