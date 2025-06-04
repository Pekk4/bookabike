package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	// Testify to be added later
)

type Message struct {
	Text string `json:"text"`
}

type Booking struct {
	StartDate string  `json:"startDate"`
	EndDate   string  `json:"endDate"`
	UserID    *string `json:"userId,omitempty"` // optional, to be deleted, ID needed
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received ping request from %s", r.RemoteAddr)
	msg := Message{Text: "pong"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(msg)
}

func bookingHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received booking request from %s", r.RemoteAddr)

	var booking Booking
	if err := json.NewDecoder(r.Body).Decode(&booking); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Booking details: %+v", booking)

	w.Header().Set("Content-Type", "application/json")
	//response := map[string]string{"status": "success", "message": "Booking received"}
	//json.NewEncoder(w).Encode(response)
	json.NewEncoder(w).Encode(booking)
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
	r := mux.NewRouter()
	r.HandleFunc("/api/ping", pingHandler).Methods("GET")
	r.HandleFunc("/api/booking", bookingHandler).Methods("POST")

	// CORS preflight requests
	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
	}).Methods("OPTIONS")

	handler := corsMiddleware(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running on :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
