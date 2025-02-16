package database

import (
	"fmt"
	"log"
	"sync"

	"github.com/brunocroh/bolhadev.chat/config"
	"github.com/jmoiron/sqlx"
)

var (
	db   *sqlx.DB
	once sync.Once
)

func GetDB() *sqlx.DB {
	once.Do(
		func() {
			config, err := config.LoadDatabaseConfig()
			if err != nil {
				log.Fatalln(err)
			}

			connectionString := config.GetConnectionString()

			fmt.Println(connectionString)

			_db, err := sqlx.Connect("postgres", connectionString)

			db = _db

			if err != nil {
				log.Fatalln(err)
			}

			if err := db.Ping(); err != nil {
				log.Fatal(err)
			} else {
				log.Println("Successfully Connected")
			}

		},
	)

	return db
}

func CloseDB() error {
	if db != nil {
		return db.Close()
	}
	return nil
}
