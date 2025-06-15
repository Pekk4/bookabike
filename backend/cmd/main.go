package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	"github.com/pekk4/bookabike/backend/internal/db"
	"github.com/pekk4/bookabike/backend/internal/handlers"
	h "github.com/pekk4/bookabike/backend/internal/handlers"
	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	s "github.com/pekk4/bookabike/backend/internal/services"
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
	bookingHandler := h.NewBookingHandler(bookingService)

	r := mux.NewRouter()
	r.HandleFunc("/api/ping", handlers.Healthcheck).Methods("GET")
	r.HandleFunc("/api/booking", bookingHandler.CreateBooking).Methods("POST")

	// Getting bookings disabled until new changes are implemented
	//r.HandleFunc("/api/booking", getBookingsHandler).Methods("GET")

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
