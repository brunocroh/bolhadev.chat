package config

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/cognitoidentityprovider"
)

type Aws struct {
	CognitoClient *cognitoidentityprovider.Client
}

type CognitoConfig struct {
	ClientId     string
	ClientSecret string
}

var ()

func (a *Aws) GetCognitoConfig() CognitoConfig {
	return CognitoConfig{
		ClientId:     os.Getenv("AWS_COGNITO_CLIENT_ID"),
		ClientSecret: os.Getenv("AWS_COGNITO_SECRET"),
	}
}

func (a *Aws) CalculateSecretHash(username, clientID, clientSecret string) *string {
	mac := hmac.New(sha256.New, []byte(clientSecret))
	mac.Write([]byte(username + clientID))
	return aws.String(base64.StdEncoding.EncodeToString(mac.Sum(nil)))
}

func NewAws() *Aws {
	ctx := context.Background()
	sdkConfig, err := awsConfig.LoadDefaultConfig(ctx)

	if err != nil {
		log.Fatalf("Couldn't load default configuration. Have you set up your AWS account?")
		return nil
	}

	return &Aws{
		CognitoClient: cognitoidentityprovider.NewFromConfig(sdkConfig),
	}
}
