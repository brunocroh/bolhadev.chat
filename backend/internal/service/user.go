package service

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

type UserService struct {
	db *sqlx.DB
}

func (s *UserService) getUser(ID string) string {
	fmt.Println("id: ", ID)

	return ID
}
