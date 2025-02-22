package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.66

import (
	"context"

	"github.com/brunocroh/bolhadev.chat/internal/model"
)

// SignUp is the resolver for the signUp field.
func (r *mutationResolver) SignUp(ctx context.Context, email string, password string) (*model.LoginResponse, error) {
	r.Resolver.Service.AuthService.SignUp(ctx, email, password)

	return &model.LoginResponse{
		Token: "ok",
	}, nil
}

// GetUser is the resolver for the getUser field.
func (r *queryResolver) GetUser(ctx context.Context) (*model.User, error) {
	user := model.User{
		ID:   "1",
		Name: "Bruno Rodrigues",
	}
	return &user, nil
}

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
/*
	func (r *mutationResolver) Login(ctx context.Context, email string, password string) (*model.LoginResponse, error) {
	r.Service.AuthService.Login(ctx, email, password)

	return &model.LoginResponse{
		Token: "teste",
	}, nil
}
*/
