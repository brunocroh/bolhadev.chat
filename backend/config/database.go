package config

import (
	"fmt"
	"os"
	"strconv"
)

type DatabaseConfig struct {
	Host     string
	Port     int
	Name     string
	User     string
	Password string
}

func LoadDatabaseConfig() (*DatabaseConfig, error) {

	host := os.Getenv("DB_HOST")
	if host == "" {
		return nil, fmt.Errorf("DB_HOST environment variable is required")
	}

	envPort := os.Getenv("DB_PORT")
	if envPort == "" {
		return nil, fmt.Errorf("DB_PORT environment variable is required")
	}

	port, err := strconv.Atoi(envPort)

	if err != nil {
		return nil, fmt.Errorf("DB_PORT environment variable is required")
	}

	name := os.Getenv("DB_NAME")
	if name == "" {
		return nil, fmt.Errorf("DB_NAME environment variable is required")
	}

	user := os.Getenv("DB_USER")
	if user == "" {
		return nil, fmt.Errorf("DB_USER environment variable is required")
	}

	password := os.Getenv("DB_PASSWORD")
	if password == "" {
		return nil, fmt.Errorf("DB_PASSWORD environment variable is required")
	}

	return &DatabaseConfig{
		Host:     host,
		Port:     port,
		Name:     name,
		User:     user,
		Password: password,
	}, nil
}

func (c *DatabaseConfig) GetConnectionString() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		c.Host, c.Port, c.User, c.Password, c.Name,
	)

}
