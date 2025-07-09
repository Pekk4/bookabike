package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	d "github.com/pekk4/bookabike/backend/internal/db"
	h "github.com/pekk4/bookabike/backend/internal/handlers"
	m "github.com/pekk4/bookabike/backend/internal/middleware"
	r "github.com/pekk4/bookabike/backend/internal/routes"
	s "github.com/pekk4/bookabike/backend/internal/services"
	u "github.com/pekk4/bookabike/backend/internal/utils"
)

func main() {
	// Main setup //

	// Load configuration from environment variables
	cfg := u.LoadConfigFromEnv()

	// Init DB connection
	c := d.NewConnection(cfg)

	// Check if the connection is successful
	err := c.Ping()
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}
	defer c.Close()

	// Assign DB connection to the BookingRepository interface
	var bookingRepo d.BookingRepository = c

	// Initialize Keycloak client
	keycloakClient := s.NewKeycloakClient(cfg)

	// Initialize services
	bookingService := s.NewBookingService(bookingRepo)
	adminService := s.NewAdminService(bookingRepo, keycloakClient)

	// Initialize handlers
	bookingHandler := h.NewBookingHandler(bookingService)
	adminHandler := h.NewAdminHandler(adminService)

	handlers := &r.Handlers{
		BookingHandler: bookingHandler,
		AdminHandler:   adminHandler,
	}

	// Register routes and assign middlewares
	router := r.RegisterRoutes(handlers)
	handler := m.CORSMiddleware(cfg)(m.AuthMiddleware(cfg, keycloakClient)(router))

	// Configure server
	server := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: handler,
	}

	// Graceful shutdown setup //

	// Create a channel to listen for interrupt signal
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	// Start server in a goroutine
	go func() {
		log.Println("Starting server on port", cfg.Port)

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Wait for interrupt
	<-stop
	log.Println("Shutdown signal received")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Graceful shutdown failed: %v", err)
	}

	log.Println("Server shut down gracefully")
}
