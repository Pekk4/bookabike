package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	"github.com/pekk4/bookabike/backend/internal/db"
	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	m "github.com/pekk4/bookabike/backend/internal/models"
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

func createBookingHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received booking request from %s", r.RemoteAddr)

	// Read the raw body
	//body, err := io.ReadAll(r.Body)
	//if err != nil {
	//	http.Error(w, "Failed to read request body", http.StatusBadRequest)
	//	return
	//}
	//log.Printf("Raw JSON body: %s", string(body))

	var booking m.Booking
	if err := json.NewDecoder(r.Body).Decode(&booking); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Println("Booking details:", booking)

	dbConn := db.NewConnection()
	defer dbConn.Close()

	// ad hoc test, bad practice
	var (
		createdBooking m.Booking
		err            error
	)

	userID, ok := r.Context().Value(mw.ContextKeyUserID).(string)
	if !ok || userID == "" {
		log.Println("User ID not found in context, interrupting...")
		http.Error(w, "Unauthorized: User ID not found", http.StatusUnauthorized)
		return
	}

	countActiveBookings, err := dbConn.CountActiveBookingsForUser(userID)
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error counting active bookings for user %s: %v", userID, err)
		http.Error(w, "Failed to count active bookings", http.StatusInternalServerError)
		return
	}

	if countActiveBookings > 0 {
		booking.Status = "wished"
	} else {
		booking.Status = "pending"
	}

	booking.UserID = userID
	createdBooking, err = dbConn.CreateBooking(booking)
	if err != nil {
		// TODO: error handling and logging
		log.Printf("Error creating booking: %v", err)
		http.Error(w, "Failed to create booking", http.StatusInternalServerError)
		return
	}

	log.Printf("Booking created successfully: %+v", createdBooking)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(createdBooking)
}

func getBookingsHandler(w http.ResponseWriter, r *http.Request) {
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

func main() {
	c := db.NewConnection()
	err := c.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer c.Close()

	r := mux.NewRouter()
	r.HandleFunc("/api/ping", pingHandler).Methods("GET")
	r.HandleFunc("/api/booking", createBookingHandler).Methods("POST")
	r.HandleFunc("/api/booking", getBookingsHandler).Methods("GET")

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
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
