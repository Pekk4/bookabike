package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"

	u "github.com/pekk4/bookabike/backend/internal/utils"
)

type conn struct {
	db *sql.DB
}

func NewConnection(cfg *u.AppConfig) *conn {
	psqlInfo := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBSSLMode,
	)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatal(err)
	}

	connection := new(conn)
	connection.db = db

	return connection
}

func (c *conn) Close() error {
	return c.db.Close()
}

func (c *conn) Ping() error {
	return c.db.Ping()
}
