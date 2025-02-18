package service

import (
	"github.com/brunocroh/bolhadev.chat/config"
	"github.com/jmoiron/sqlx"
)

type Service struct {
	AuthService *AuthService
	UserService *UserService
}

func NewService(db *sqlx.DB, aws *config.Aws) *Service {
	return &Service{
		UserService: &UserService{db},
		AuthService: &AuthService{db, aws},
	}
}
