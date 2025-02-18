package service

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
	"github.com/brunocroh/bolhadev.chat/config"
	"github.com/jmoiron/sqlx"
)

type AuthService struct {
	db  *sqlx.DB
	aws *config.Aws
}

func (s *AuthService) Login(ctx context.Context, email string, password string) string {
	cognitoConfig := s.aws.GetCognitoConfig()

	user, err := s.aws.CognitoClient.SignUp(ctx, &cognitoidentityprovider.SignUpInput{
		SecretHash: s.aws.CalculateSecretHash(email, cognitoConfig.ClientId, cognitoConfig.ClientSecret),
		ClientId:   aws.String(cognitoConfig.ClientId),
		Username:   aws.String(email),
		Password:   aws.String(password),
	})

	if err != nil {
		log.Printf("fail to register user %v", err)
	}

	log.Println(user)
	return "123"
}
