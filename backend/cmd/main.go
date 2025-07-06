package main

import (
	"log"
	"net/http"
	"os"

	"github.com/pekk4/bookabike/backend/internal/db"
	h "github.com/pekk4/bookabike/backend/internal/handlers"
	mw "github.com/pekk4/bookabike/backend/internal/middleware"
	r "github.com/pekk4/bookabike/backend/internal/routes"
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

	// ???
	var repo db.BookingRepository = c

	keycloakClient := s.NewKeycloakClient(
		u.GetEnvOrFail("KEYCLOAK_BASE_URL"),
		u.GetEnvOrFail("KEYCLOAK_REALM"),
		u.GetEnvOrFail("KEYCLOAK_CLIENT_ID"),
		u.GetEnvOrFail("KEYCLOAK_CLIENT_SECRET"),
	)

	bookingService := s.NewBookingService(repo)
	adminService := s.NewAdminService(repo, keycloakClient)

	bookingHandler := h.NewBookingHandler(bookingService)
	adminHandler := h.NewAdminHandler(adminService)

	handlers := &r.Handlers{
		BookingHandler: bookingHandler,
		AdminHandler:   adminHandler,
	}

	router := r.RegisterRoutes(handlers)

	// CORS preflight requests
	//r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	//	if r.Method == "OPTIONS" {
	//		w.WriteHeader(http.StatusNoContent)
	//		return
	//	}
	//}).Methods("OPTIONS")

	handler := mw.CORSMiddleware(mw.AuthMiddleware(router))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running on :%s\n", port)
	// TODO: implement a graceful shutdown mechanism
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
