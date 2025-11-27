package main

import (
	"log"
	"server/db"
	"server/internal/user"
)

func main() {
	dbConnection, err := db.NewDatabase()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	
	log.Println("Database connection established successfully!!!!")

	userRep := user.NewRepository(dbConnection.GetDB())
	userServ := user.NewService(userRep)
	userHandler := user.NewHandler(userServ)
}