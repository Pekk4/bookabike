package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	// Testify to be added later

	"github.com/pekk4/bookabike/backend/pkg/authi"
	"github.com/pekk4/bookabike/backend/pkg/db"
	t "github.com/pekk4/bookabike/backend/pkg/types"
)

type Message struct {
	Text string `json:"text"`
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received ping request from %s", r.RemoteAddr)
	msg := Message{Text: "pong"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(msg)
}

func bookingHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received booking request from %s", r.RemoteAddr)

	var booking t.Booking
	if err := json.NewDecoder(r.Body).Decode(&booking); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	dbConn := db.NewConnection()
	defer dbConn.Close()

	createdBooking, err := dbConn.CreateBooking(booking)
	if err != nil {
		log.Printf("Error creating booking: %v", err)
		http.Error(w, "Failed to create booking", http.StatusInternalServerError)
		return
	}

	log.Printf("Booking created successfully: %+v", createdBooking)

	//log.Printf("Booking details: %+v", booking)

	w.Header().Set("Content-Type", "application/json")
	//response := map[string]string{"status": "success", "message": "Booking received"}
	//json.NewEncoder(w).Encode(response)
	json.NewEncoder(w).Encode(createdBooking)
}

func getBookingsHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received request for all bookings from %s", r.RemoteAddr)

	dbConn := db.NewConnection()
	defer dbConn.Close()

	bookings, err := dbConn.GetAllBookings()
	if err != nil {
		log.Printf("Error retrieving bookings: %v", err)
		http.Error(w, "Failed to retrieve bookings", http.StatusInternalServerError)
		return
	}

	log.Printf("Retrieved %d bookings", len(bookings))

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}

// ad hoc CORS middleware setup // TODO: improve & clean up
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	c := db.NewConnection()
	err := c.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer c.Close()

	//keycloak := authi.NewKeycloak() // Initialize Keycloak client

	//middleware := authi.AuthMiddleware() // Initialize Keycloak middleware

	r := mux.NewRouter()
	r.HandleFunc("/api/ping", pingHandler).Methods("GET")
	r.HandleFunc("/api/booking", bookingHandler).Methods("POST")
	r.HandleFunc("/api/booking", getBookingsHandler).Methods("GET")

	// CORS preflight requests
	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}).Methods("OPTIONS")

	//r.Use(middleware.VerifyToken) // Apply Keycloak middleware to all routes

	handler := corsMiddleware(authi.AuthMiddleware(r))

	port := os.Getenv("PORT")
	log.Println(port)
	log.Println("Port: ", port)
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
