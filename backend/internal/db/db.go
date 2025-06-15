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

// To be deleted...
type Conn interface {
	Close() error
	Ping() error
}

var (
	host     = u.GetEnvOrFail("DB_HOST")
	port     = u.GetEnvOrFail("DB_PORT")
	user     = u.GetEnvOrFail("DB_USER")
	password = u.GetEnvOrFail("DB_PASSWORD")
	dbname   = u.GetEnvOrFail("DB_NAME")
)

func NewConnection() *conn {
	psqlInfo := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname,
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
