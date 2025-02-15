package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/brunocroh/bolhadev.chat/config"
	"github.com/brunocroh/bolhadev.chat/internal/graph"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

var (
	DBHOST     = os.Getenv("DB_HOST")
	DBPORT     = 5432
	DBNAME     = os.Getenv("DB_NAME")
	DBUSER     = os.Getenv("DB_USER")
	DBPASSWORD = os.Getenv("DB_PASSWORD")
)

func main() {
  config, err := config.LoadDatabaseConfig()
  if err != nil {
    fmt.Errorf("Fail to load database config")
  }


  connectionString := config.GetConnectionString()
  
  fmt.Println(connectionString)

  db, err := sqlx.Connect("postgres", connectionString)
    if err != nil {
        log.Fatalln(err)
    }
 if err := db.Ping(); err != nil {
        log.Fatal(err)
    } else {
        log.Println("Successfully Connected")
    }

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
