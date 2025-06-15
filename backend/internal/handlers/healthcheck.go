package handlers

import (
	"encoding/json"
	"log"
	"net/http"
)

type Message struct {
	Text string `json:"text"`
}

func Healthcheck(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received healthcheck request from %s", r.RemoteAddr)
	msg := Message{Text: "pong"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(msg)
}
